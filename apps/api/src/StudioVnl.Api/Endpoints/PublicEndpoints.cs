using Microsoft.EntityFrameworkCore;
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

    /// <summary>Langues supportées ; toute autre valeur retombe sur "fr".</summary>
    private static string NormalizeLocale(string? locale) => locale == "nl" ? "nl" : "fr";

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
    /// catégorie ajoutée ou dépubliée s'y reflète sans déploiement. Toutes
    /// les pages existent désormais dans les deux langues, mentions légales
    /// et confidentialité incluses.
    /// </summary>
    private static async Task<IResult> GetSitemapAsync(
        AppDbContext db,
        IConfiguration configuration,
        CancellationToken cancellationToken)
    {
        var origin = configuration["Site:Origin"] ?? "https://heavenmotion.be";

        var frSlugs = await db.Categories
            .Where(c => c.IsPublished && c.Locale == "fr")
            .OrderBy(c => c.SortOrder)
            .Select(c => c.Slug)
            .ToListAsync(cancellationToken);
        var nlSlugs = await db.Categories
            .Where(c => c.IsPublished && c.Locale == "nl")
            .OrderBy(c => c.SortOrder)
            .Select(c => c.Slug)
            .ToListAsync(cancellationToken);

        // `AltPath` porte l'URL de l'autre langue de la même page : sert à
        // générer le `xhtml:link rel="alternate" hreflang="…"` de chaque
        // entrée, pour que les moteurs de recherche relient les deux versions
        // depuis le sitemap déjà, pas seulement depuis les balises `<head>`.
        var urls = new List<(string Path, string ChangeFreq, string Priority, string AltPath, string AltHreflang)>
        {
            ("/", "weekly", "1.0", "/nl", "nl"),
            ("/nl", "weekly", "1.0", "/", "fr"),
            ("/a-propos", "monthly", "0.5", "/nl/over-ons", "nl"),
            ("/nl/over-ons", "monthly", "0.5", "/a-propos", "fr"),
            ("/faq", "monthly", "0.5", "/nl/faq", "nl"),
            ("/nl/faq", "monthly", "0.5", "/faq", "fr"),
            ("/contact", "monthly", "0.5", "/nl/contact", "nl"),
            ("/nl/contact", "monthly", "0.5", "/contact", "fr"),
            ("/mentions-legales", "yearly", "0.2", "/nl/wettelijke-vermeldingen", "nl"),
            ("/nl/wettelijke-vermeldingen", "yearly", "0.2", "/mentions-legales", "fr"),
            ("/confidentialite", "yearly", "0.2", "/nl/privacybeleid", "nl"),
            ("/nl/privacybeleid", "yearly", "0.2", "/confidentialite", "fr"),
        };
        // Priorité de sitemap relevée pour Clip/Lifestyle et Wemmel : lancement
        // volontairement positionné sur ces mots-clés à faible concurrence
        // plutôt que sur Mariage/Corporate à Bruxelles, déjà saturés par des
        // studios établis et des annuaires (starofservice, sortlist…).
        // `frSlugs`/`nlSlugs` sont triées par le même `SortOrder` (la fiche NL
        // reprend celui de la fiche FR à sa création) : on peut donc les
        // apparier par position pour le hreflang, sans mapping de slugs dédié.
        var categoryPairCount = Math.Min(frSlugs.Count, nlSlugs.Count);
        for (var i = 0; i < categoryPairCount; i++)
        {
            var priority = LaunchPriorityCategorySlugs.Contains(frSlugs[i]) ? "0.9" : "0.8";
            urls.Add(($"/realisations/{frSlugs[i]}", "weekly", priority, $"/nl/realisaties/{nlSlugs[i]}", "nl"));
            urls.Add(($"/nl/realisaties/{nlSlugs[i]}", "weekly", priority, $"/realisations/{frSlugs[i]}", "fr"));
        }
        urls.Add(("/zones", "monthly", "0.6", "/nl/zones", "nl"));
        urls.Add(("/nl/zones", "monthly", "0.6", "/zones", "fr"));
        urls.AddRange(CommuneSlugs.Select(c =>
            ($"/zones/{c.Fr}", "monthly", c.Fr == "wemmel" ? "0.8" : "0.6", $"/nl/zones/{c.Nl}", "nl")));
        urls.AddRange(CommuneSlugs.Select(c =>
            ($"/nl/zones/{c.Nl}", "monthly", c.Nl == "wemmel" ? "0.8" : "0.6", $"/zones/{c.Fr}", "fr")));

        // Pas de date de modification par page suivie en base (catégories,
        // pages statiques) : `lastmod` reflète l'heure de génération du
        // sitemap, pas une vraie date de changement de contenu — plus honnête
        // qu'une date inventée par page, et toujours mieux qu'une balise
        // absente pour des robots qui s'en servent pour prioriser leur crawl.
        var lastmod = DateTime.UtcNow.ToString("yyyy-MM-dd");

        var body = string.Concat(urls.Select(u =>
            $"""
              <url>
                <loc>{origin}{u.Path}</loc>
                <lastmod>{lastmod}</lastmod>
                <changefreq>{u.ChangeFreq}</changefreq>
                <priority>{u.Priority}</priority>
                <xhtml:link rel="alternate" hreflang="{u.AltHreflang}" href="{origin}{u.AltPath}" />
              </url>
            """));

        var xml =
            $"""
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
            {body}</urlset>
            """;

        return Results.Text(xml, "application/xml");
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
