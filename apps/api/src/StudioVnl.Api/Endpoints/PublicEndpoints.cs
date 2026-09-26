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
    /// Les 19 communes de la Région de Bruxelles-Capitale, pour le sitemap
    /// uniquement. Liste administrative fixe : un dictionnaire statique ici
    /// évite une table dédiée pour un contenu qui ne change jamais — même
    /// principe et même duplication assumée que `CATEGORY_SLUG_MAP` côté
    /// front (`communes.ts`), qui porte la version complète (noms, codes
    /// postaux) utilisée pour construire les pages elles-mêmes.
    /// </summary>
    private static readonly (string Fr, string Nl)[] CommuneSlugs =
    [
        ("bruxelles-ville", "stad-brussel"),
        ("anderlecht", "anderlecht"),
        ("auderghem", "oudergem"),
        ("berchem-sainte-agathe", "sint-agatha-berchem"),
        ("etterbeek", "etterbeek"),
        ("evere", "evere"),
        ("forest", "vorst"),
        ("ganshoren", "ganshoren"),
        ("ixelles", "elsene"),
        ("jette", "jette"),
        ("koekelberg", "koekelberg"),
        ("molenbeek-saint-jean", "sint-jans-molenbeek"),
        ("saint-gilles", "sint-gillis"),
        ("saint-josse-ten-noode", "sint-joost-ten-node"),
        ("schaerbeek", "schaarbeek"),
        ("uccle", "ukkel"),
        ("watermael-boitsfort", "watermaal-bosvoorde"),
        ("woluwe-saint-lambert", "sint-lambrechts-woluwe"),
        ("woluwe-saint-pierre", "sint-pieters-woluwe"),
        // Périphérie flamande autour de Wemmel : pas des communes de la
        // Région de Bruxelles-Capitale, mais dans la même zone d'intervention.
        ("wemmel", "wemmel"),
        ("grimbergen", "grimbergen"),
        ("meise", "meise"),
        ("asse", "asse"),
        ("dilbeek", "dilbeek"),
        ("vilvorde", "vilvoorde"),
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
            (Localized("/zones", "/nl/zones", null), "monthly", "0.6"),
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

        entries.AddRange(CommuneSlugs.Select(c => (
            Localized($"/zones/{c.Fr}", $"/nl/zones/{c.Nl}", null),
            "monthly",
            c.Fr == "wemmel" ? "0.8" : "0.6")));

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
                body.Append(
                    $"""
                      <url>
                        <loc>{origin}{path}</loc>
                        <lastmod>{lastmod}</lastmod>
                        <changefreq>{changeFreq}</changefreq>
                        <priority>{priority}</priority>
                    {alternates}    <xhtml:link rel="alternate" hreflang="x-default" href="{origin}{paths[Locales.French]}" />
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
    private static Dictionary<string, string?> Localized(string fr, string? nl, string? en) => new()
    {
        [Locales.French] = fr == "" ? "/" : fr,
        [Locales.Dutch] = nl == "" ? "/nl" : nl,
        [Locales.English] = en == "" ? "/en" : en,
    };

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
