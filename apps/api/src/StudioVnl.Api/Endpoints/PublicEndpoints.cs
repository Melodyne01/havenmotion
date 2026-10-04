using System.Text;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Application;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;
using StudioVnl.Infrastructure.Email;

namespace StudioVnl.Api.Endpoints;

public static class PublicEndpoints
{
    public static void MapPublicEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/public").WithTags("Public");

        group.MapGet("/site", GetSiteAsync);
        group.MapGet("/categories", GetCategoriesAsync);
        group.MapGet("/categories/{slug}/films", GetFilmsAsync);
        group.MapGet("/projects", GetProjectsAsync);
        group.MapGet("/projects/{slug}", GetProjectAsync);
        group.MapGet("/reviews", GetReviewsAsync);
        group.MapGet("/sitemap.xml", GetSitemapAsync);
        group.MapPost("/leads", CreateLeadAsync)
            .RequireRateLimiting("leads")
            .AddEndpointFilter<ValidationFilter<CreateLeadRequest>>();
    }

    private static string NormalizeLocale(string? locale) => Locales.Normalize(locale);

    /// <summary>
    /// Slugs de catégorie à prioriser au lancement (même valeur FR/NL) : Clip
    /// et Lifestyle, moins disputés par les grosses agences bruxelloises que
    /// Mariage/Corporate, sur demande du client.
    /// </summary>
    private static readonly HashSet<string> LaunchPriorityCategorySlugs = ["clip", "lifestyle"];

    /// <summary>
    /// Pages zones (pays et régions) qui existent, par langue, pour le sitemap
    /// uniquement. Une région n'a une page que dans les langues où elle a un
    /// contenu rédigé (`region-content.ts` côté front) : cette liste doit
    /// rester synchronisée avec elle — même duplication assumée que
    /// `CATEGORY_SLUG_MAP`. `null` = pas de page dans cette langue.
    /// </summary>
    private static readonly (string? Fr, string? Nl, string? En)[] ZonePages =
    [
        // Pays
        ("/zones/belgique", "/nl/zones/belgie", "/en/areas/belgium"),
        ("/zones/france", "/nl/zones/frankrijk", "/en/areas/france"),
        ("/zones/luxembourg", "/nl/zones/luxemburg", "/en/areas/luxembourg"),
        ("/zones/pays-bas", "/nl/zones/nederland", "/en/areas/netherlands"),
        ("/zones/international", "/nl/zones/internationaal", "/en/areas/international"),
        // Régions, phase 1
        ("/zones/belgique/bruxelles", "/nl/zones/belgie/brussel", "/en/areas/belgium/brussels"),
        ("/zones/belgique/brabant-flamand", "/nl/zones/belgie/vlaams-brabant", null),
        ("/zones/belgique/brabant-wallon", "/nl/zones/belgie/waals-brabant", null),
        ("/zones/luxembourg/luxembourg", "/nl/zones/luxemburg/luxembourg", "/en/areas/luxembourg/luxembourg"),
        ("/zones/france/lille-nord", null, "/en/areas/france/lille"),
        // Régions, phase 2
        ("/zones/belgique/anvers", "/nl/zones/belgie/antwerpen", "/en/areas/belgium/antwerp"),
        ("/zones/belgique/flandre-orientale", "/nl/zones/belgie/oost-vlaanderen", "/en/areas/belgium/ghent-east-flanders"),
        ("/zones/belgique/flandre-occidentale", "/nl/zones/belgie/west-vlaanderen", "/en/areas/belgium/bruges-west-flanders"),
        ("/zones/belgique/limbourg", "/nl/zones/belgie/limburg", null),
        ("/zones/belgique/hainaut", null, null),
        ("/zones/belgique/namur", null, null),
        ("/zones/belgique/liege", null, null),
        ("/zones/belgique/ardennes", "/nl/zones/belgie/ardennen", "/en/areas/belgium/ardennes"),
        ("/zones/france/pas-de-calais-cote-d-opale", null, null),
        ("/zones/france/picardie-oise", null, null),
        (null, "/nl/zones/nederland/nederlands-limburg", "/en/areas/netherlands/maastricht-limburg"),
        (null, "/nl/zones/nederland/noord-brabant", null),
        ("/zones/international/etranger", "/nl/zones/internationaal/buitenland", "/en/areas/international/destination"),
        // Régions, phase 3
        ("/zones/france/champagne", null, null),
        ("/zones/france/paris-ile-de-france", null, "/en/areas/france/paris"),
        (null, "/nl/zones/nederland/zeeland", null),
        (null, "/nl/zones/nederland/zuid-holland", null),
        (null, "/nl/zones/nederland/utrecht", null),
        (null, "/nl/zones/nederland/noord-holland", "/en/areas/netherlands/amsterdam"),
    ];

    private static async Task<SitePayloadDto> GetSiteAsync(
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);

        var settings = await db.SiteSettings
            .Include(s => s.ShowreelMedia)
            .Where(s => s.Locale == loc)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken) ?? new SiteSettings();

        var services = await db.Services.Where(s => s.Locale == loc).AsNoTracking()
            .OrderBy(s => s.SortOrder).ToListAsync(cancellationToken);
        var steps = await db.ProcessSteps.Where(p => p.Locale == loc).AsNoTracking()
            .OrderBy(s => s.SortOrder).ToListAsync(cancellationToken);
        var testimonials = await db.Testimonials.Where(t => t.Locale == loc).AsNoTracking()
            .OrderBy(t => t.SortOrder).ToListAsync(cancellationToken);
        var logos = await db.ClientLogos.AsNoTracking()
            .OrderBy(l => l.SortOrder).ToListAsync(cancellationToken);

        return new SitePayloadDto(
            new SiteSettingsDto(
                settings.BrandName,
                settings.Tagline,
                settings.Email,
                settings.Instagram,
                settings.City,
                settings.Region,
                settings.LegalText,
                settings.ShowreelMedia?.ToDto(storage.GetPublicUrl)),
            services.Select(s => s.ToDto()).ToList(),
            steps.Select(s => s.ToDto()).ToList(),
            new AboutDto(
                string.IsNullOrEmpty(settings.AboutPortraitUrl) ? null : settings.AboutPortraitUrl,
                DtoMapper.ParseStringList(settings.AboutParagraphsJson)),
            testimonials.Select(t => t.ToDto()).ToList(),
            logos.Select(l => l.ToDto()).ToList());
    }

    private static async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);

        var categories = await db.Categories
            .Include(c => c.ReelMedia)
            .Include(c => c.PosterMedia)
            .Where(c => c.IsPublished && c.Locale == loc)
            .OrderBy(c => c.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var counts = await db.Films
            .Where(f => f.Status == PublishStatus.Published)
            .GroupBy(f => f.CategoryId)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.Key, g => g.Count, cancellationToken);

        return categories
            .Select(c => c.ToDto(storage.GetPublicUrl, counts.GetValueOrDefault(c.Id)))
            .ToList();
    }

    /// <summary>
    /// Sitemap généré depuis la base plutôt qu'un fichier statique : une
    /// catégorie ajoutée ou dépubliée s'y reflète sans déploiement. Chaque
    /// page existe en FR, NL et EN (sauf les pages zones/commune, FR et NL
    /// seulement pour l'instant) : chaque entrée déclare les versions des
    /// autres langues en `xhtml:link rel="alternate" hreflang="…"`, pour que
    /// les moteurs relient les versions depuis le sitemap déjà, pas
    /// seulement depuis les balises `<head>`.
    /// </summary>
    private static async Task<IResult> GetSitemapAsync(
        AppDbContext db,
        IConfiguration configuration,
        CancellationToken cancellationToken)
    {
        var origin = configuration["Site:Origin"] ?? "https://heavenmotion.be";

        // Slugs de catégorie par langue, triés par `SortOrder` (la fiche NL et
        // la fiche EN reprennent celui de la fiche FR à leur création) : on
        // peut donc les apparier par position pour le hreflang, sans mapping
        // de slugs dédié.
        var slugsByLocale = new Dictionary<string, List<string>>();
        foreach (var locale in Locales.All)
        {
            slugsByLocale[locale] = await db.Categories
                .Where(c => c.IsPublished && c.Locale == locale)
                .OrderBy(c => c.SortOrder)
                .Select(c => c.Slug)
                .ToListAsync(cancellationToken);
        }

        // Une entrée = un chemin par langue (null quand la page n'existe pas
        // dans cette langue) ; chaque chemin non nul devient une URL du
        // sitemap, avec les autres comme alternates.
        var entries = new List<(Dictionary<string, string?> Paths, string ChangeFreq, string Priority)>
        {
            (Localized("", "", ""), "weekly", "1.0"),
            (Localized("/tarifs", "/nl/tarieven", "/en/pricing"), "weekly", "0.9"),
            (Localized("/a-propos", "/nl/over-ons", "/en/about"), "monthly", "0.5"),
            (Localized("/faq", "/nl/faq", "/en/faq"), "monthly", "0.5"),
            (Localized("/contact", "/nl/contact", "/en/contact"), "monthly", "0.5"),
            (Localized("/mentions-legales", "/nl/wettelijke-vermeldingen", "/en/legal-notice"), "yearly", "0.2"),
            (Localized("/confidentialite", "/nl/privacybeleid", "/en/privacy"), "yearly", "0.2"),
            (Localized("/zones", "/nl/zones", "/en/areas"), "monthly", "0.6"),
            (Localized("/photo-et-video-une-seule-personne", "/nl/foto-en-video-door-een-persoon", "/en/one-photographer-videographer"), "monthly", "0.8"),
        };

        var categoryCount = slugsByLocale.Values.Min(list => list.Count);
        for (var i = 0; i < categoryCount; i++)
        {
            var fr = slugsByLocale[Locales.French][i];
            var priority = LaunchPriorityCategorySlugs.Contains(fr) ? "0.9" : "0.8";
            entries.Add((
                Localized(
                    $"/prestations/{fr}",
                    $"/nl/diensten/{slugsByLocale[Locales.Dutch][i]}",
                    $"/en/services/{slugsByLocale[Locales.English][i]}"),
                "weekly",
                priority));
        }

        // Guides : un guide par langue de marché, reliés par groupe pour les
        // alternates quand la même intention existe dans plusieurs langues (voir `guide-content.ts`
        // côté front, à garder synchronisé).
        entries.Add((Localized("/guides", "/nl/gidsen", "/en/guides"), "weekly", "0.6"));
        entries.Add((Localized("/guides/prix-photographe-videaste-mariage-belgique-2026", "/nl/gidsen/wat-kost-een-huwelijksfotograaf-en-videograaf-belgie-2026", "/en/guides/wedding-photographer-cost-belgium-2026"), "monthly", "0.8"));
        entries.Add((Localized("/guides/photographe-ou-videaste-mariage-lequel-choisir", "/nl/gidsen/trouwfotograaf-of-videograaf-wat-kiezen", "/en/guides/wedding-photographer-or-videographer-which-to-choose"), "monthly", "0.7"));
        entries.Add((Localized("/guides/prix-video-entreprise-belgique-2026", "/nl/gidsen/wat-kost-een-bedrijfsvideo-belgie-2026", null), "monthly", "0.8"));
        entries.Add((Localized(null, null, "/en/guides/getting-married-in-brussels-expat-guide"), "monthly", "0.7"));
        entries.Add((Localized("/guides/lieux-mariage-brabant-wallon", null, null), "monthly", "0.7"));
        entries.Add((Localized(null, "/nl/gidsen/trouwen-in-de-ardennen-locaties-en-tips", null), "monthly", "0.7"));
        entries.Add((Localized("/guides/se-marier-a-durbuy-lieux-mairie-photos", null, null), "monthly", "0.7"));
        entries.Add((Localized("/guides/spots-shooting-photo-bruxelles", null, "/en/guides/photoshoot-locations-brussels"), "monthly", "0.7"));
        entries.Add((Localized("/guides/photos-communion-profession-de-foi-quand-ou-combien", "/nl/gidsen/fotoshoot-lentefeest-communie-wanneer-waar-prijs", null), "monthly", "0.7"));
        entries.Add((Localized("/guides/photo-linkedin-professionnelle-ce-qui-marche-2026", "/nl/gidsen/professionele-linkedin-foto-wat-werkt-2026", "/en/guides/linkedin-headshot-what-works-2026"), "monthly", "0.7"));
        entries.Add((Localized("/guides/se-marier-au-luxembourg-lieux-et-demarches", null, "/en/guides/getting-married-in-luxembourg-venues-and-procedure"), "monthly", "0.7"));
        entries.Add((Localized("/guides/photographe-belge-mariage-en-france-deplacement-tva-musique", null, null), "monthly", "0.7"));
        entries.Add((Localized("/guides/drone-mariage-belgique-ce-qui-est-autorise", "/nl/gidsen/drone-op-een-huwelijk-in-belgie-wat-mag", null), "monthly", "0.7"));

        var projects = await db.Projects.AsNoTracking()
            .Where(p => p.Status == PublishStatus.Published)
            .Select(p => new { p.Slug, HasFr = p.TitleFr != "", HasNl = p.TitleNl != "", HasEn = p.TitleEn != "" })
            .ToListAsync(cancellationToken);
        if (projects.Count > 0)
        {
            entries.Add((Localized("/projets", "/nl/projecten", "/en/projects"), "weekly", "0.7"));
        }
        entries.AddRange(projects.Select(p => (
            Localized(
                p.HasFr ? $"/projets/{p.Slug}" : null,
                p.HasNl ? $"/nl/projecten/{p.Slug}" : null,
                p.HasEn ? $"/en/projects/{p.Slug}" : null),
            "monthly",
            "0.7")));

        entries.AddRange(ZonePages.Select(z => (
            Localized(z.Fr, z.Nl, z.En),
            "monthly",
            z.Fr is not null && z.Fr.Count(ch => ch == '/') >= 3 ? "0.7" : "0.6")));

        // Pas de date de modification par page suivie en base (catégories,
        // pages statiques) : `lastmod` reflète l'heure de génération du
        // sitemap, pas une vraie date de changement de contenu — plus honnête
        // qu'une date inventée par page, et toujours mieux qu'une balise
        // absente pour des robots qui s'en servent pour prioriser leur crawl.
        var lastmod = DateTime.UtcNow.ToString("yyyy-MM-dd");

        var body = new StringBuilder();
        foreach (var (paths, changeFreq, priority) in entries)
        {
            foreach (var locale in Locales.All)
            {
                var path = paths[locale];
                if (path is null)
                {
                    continue;
                }
                var alternates = string.Concat(Locales.All
                    .Where(other => other != locale && paths[other] is not null)
                    .Select(other =>
                        $"""
                            <xhtml:link rel="alternate" hreflang="{other}" href="{origin}{paths[other]}" />

                        """));
                var xDefault = paths[Locales.French] ?? path;
                body.Append(
                    $"""
                      <url>
                        <loc>{origin}{path}</loc>
                        <lastmod>{lastmod}</lastmod>
                        <changefreq>{changeFreq}</changefreq>
                        <priority>{priority}</priority>
                    {alternates}    <xhtml:link rel="alternate" hreflang="x-default" href="{origin}{xDefault}" />
                      </url>

                    """);
            }
        }

        var xml =
            $"""
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
            {body}</urlset>
            """;

        return Results.Text(xml, "application/xml");
    }

    /// <summary>Chemins d'une même page en FR, NL et EN (`null` = pas de version dans cette langue). La home NL/EN est `/nl` et `/en`.</summary>
    private static Dictionary<string, string?> Localized(string? fr, string? nl, string? en) => new()
    {
        [Locales.French] = fr == "" ? "/" : fr,
        [Locales.Dutch] = nl == "" ? "/nl" : nl,
        [Locales.English] = en == "" ? "/en" : en,
    };

    /// <summary>
    /// Projets publiés qui ont un titre dans la langue demandée, les mis en
    /// avant d'abord, puis par ordre puis date. Filtres optionnels par
    /// catégorie (clé neutre) et par région.
    /// </summary>
    private static async Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(
        string? locale,
        string? category,
        string? region,
        int? limit,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);
        var query = db.Projects
            .Include(p => p.CoverMedia)
            .Include(p => p.VideoMedia)
            .AsNoTracking()
            .Where(p => p.Status == PublishStatus.Published);
        query = loc switch
        {
            Locales.Dutch => query.Where(p => p.TitleNl != ""),
            Locales.English => query.Where(p => p.TitleEn != ""),
            _ => query.Where(p => p.TitleFr != ""),
        };
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.CategoryKey == category);
        }
        if (!string.IsNullOrEmpty(region))
        {
            query = query.Where(p => p.RegionId == region);
        }
        query = query.OrderByDescending(p => p.IsFeatured).ThenBy(p => p.SortOrder).ThenByDescending(p => p.Date);
        if (limit is > 0)
        {
            query = query.Take(limit.Value);
        }
        var projects = await query.ToListAsync(cancellationToken);
        var gallery = await AdminProjectEndpoints.LoadGalleryAsync(db, projects, cancellationToken);
        return projects.Select(p => p.ToDto(storage.GetPublicUrl, gallery)).ToList();
    }

    private static async Task<IResult> GetProjectAsync(
        string slug,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var project = await db.Projects
            .Include(p => p.CoverMedia)
            .Include(p => p.VideoMedia)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Slug == slug && p.Status == PublishStatus.Published, cancellationToken);
        if (project is null)
        {
            return Results.NotFound();
        }
        var gallery = await AdminProjectEndpoints.LoadGalleryAsync(db, [project], cancellationToken);
        return Results.Ok(project.ToDto(storage.GetPublicUrl, gallery));
    }

    /// <summary>
    /// Avis publiés : ceux dans la langue demandée d'abord, puis les autres
    /// (un avis en anglais vaut mieux qu'aucun sur la page NL).
    /// </summary>
    private static async Task<IReadOnlyList<ReviewDto>> GetReviewsAsync(
        string? locale,
        string? category,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);
        var query = db.Reviews.AsNoTracking().Where(r => r.IsPublished);
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(r => r.CategoryKey == category);
        }
        var reviews = await query.OrderBy(r => r.SortOrder).ThenByDescending(r => r.Date).ToListAsync(cancellationToken);
        return reviews
            .OrderBy(r => r.Locale == loc ? 0 : 1)
            .ThenBy(r => r.SortOrder)
            .Select(r => r.ToDto())
            .ToList();
    }

    private static async Task<IResult> GetFilmsAsync(
        string slug,
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);

        var category = await db.Categories.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug && c.Locale == loc && c.IsPublished, cancellationToken);
        if (category is null)
        {
            return Results.NotFound();
        }

        var films = await db.Films
            .Include(f => f.Category)
            .Include(f => f.Media)
            .Include(f => f.PosterMedia)
            .Where(f => f.CategoryId == category.Id && f.Status == PublishStatus.Published)
            .OrderBy(f => f.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return Results.Ok(films.Select(f => f.ToDto(storage.GetPublicUrl)).ToList());
    }

    private static async Task<IResult> CreateLeadAsync(
        CreateLeadRequest request,
        AppDbContext db,
        IEmailSender emailSender,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var lead = new Lead
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            ProjectType = request.ProjectType.Trim(),
            Pack = request.Pack?.Trim() ?? string.Empty,
            Region = request.Region?.Trim() ?? string.Empty,
            Locale = Locales.Normalize(request.Locale),
            EventDate = string.IsNullOrEmpty(request.EventDate)
                ? null
                : DateOnly.ParseExact(request.EventDate, "yyyy-MM-dd"),
            BudgetRange = request.BudgetRange.Trim(),
            Message = request.Message?.Trim() ?? string.Empty,
            Status = LeadStatus.New,
            CreatedAt = DateTime.UtcNow,
            UserAgent = httpContext.Request.Headers.UserAgent.ToString(),
        };
        db.Leads.Add(lead);
        await db.SaveChangesAsync(cancellationToken);

        var settings = await db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
        var brandName = settings?.BrandName ?? "Heaven Motion";
        var studioAddress = settings?.Email;

        // Notification au studio + accusé de réception au prospect.
        if (!string.IsNullOrEmpty(studioAddress))
        {
            await emailSender.SendAsync(
                new EmailMessage(
                    studioAddress,
                    $"Nouvelle demande de devis — {lead.ProjectType}",
                    LeadEmailTemplates.StudioNotification(lead, brandName)),
                cancellationToken);
        }
        await emailSender.SendAsync(
            new EmailMessage(
                lead.Email,
                $"{brandName} — votre demande est bien reçue",
                LeadEmailTemplates.ProspectAcknowledgement(lead, brandName)),
            cancellationToken);

        return Results.Created($"/api/admin/leads/{lead.Id}", new { id = lead.Id });
    }
}
