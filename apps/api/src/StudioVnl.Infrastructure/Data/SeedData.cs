using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Infrastructure.Data;

/// <summary>
/// Contenu de départ : cinq catégories protégées, réglages, prestations,
/// process, témoignages et comptes de démo. Aligné sur les placeholders du
/// front (`placeholder-content.ts`).
///
/// Deux passes s'exécutent ensuite à chaque démarrage, sans jamais toucher au
/// contenu saisi par le client : la reprise de l'ancienne marque et la pose
/// des boucles d'ambiance sur les emplacements encore vides.
/// </summary>
public static class SeedData
{
    public static async Task EnsureSeededAsync(IServiceProvider services, CancellationToken cancellationToken = default)
    {
        var db = services.GetRequiredService<AppDbContext>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("SeedData");

        await SeedRolesAndUsersAsync(services, logger);

        if (!await db.Categories.AnyAsync(cancellationToken))
        {
            db.Categories.AddRange(DefaultCategories());
            logger.LogInformation("Catégories de départ créées.");
        }

        if (!await db.SiteSettings.AnyAsync(cancellationToken))
        {
            db.SiteSettings.Add(new SiteSettings
            {
                Id = 1,
                BrandName = "Heaven Motion",
                Tagline = "Vidéaste freelance — mariages, marques, sport et clips.",
                Email = "contact@heavenmotion.be",
                Instagram = "@heavenmotion",
                City = "Bruxelles",
                Region = "Bruxelles-Capitale",
                LegalText = "Heaven Motion — micro-entreprise. Mentions légales à compléter.",
                AboutPortraitUrl = "/placeholders/portrait.svg",
                AboutParagraphsJson = DtoMapper.ToJson(
                [
                    "Heaven Motion est un studio vidéo indépendant basé à Bruxelles.",
                    "Je filme seul ou en équipe réduite, pour rester au plus près des gens.",
                    "Le montage cherche le rythme d’un film, pas celui d’un résumé.",
                    "Chaque projet part d’un échange, jamais d’un catalogue.",
                ]),
            });
        }

        if (!await db.Services.AnyAsync(cancellationToken))
        {
            db.Services.AddRange(
                Service("Mariage", ["Repérage", "Captation cérémonie et soirée", "Étalonnage", "Musique sous licence"], "Journée complète", "Film 5–8 min + teaser 60 s", "à partir de 1 400 €", 1),
                Service("Corporate", ["Script", "Tournage", "Interviews", "Habillage graphique"], "1 à 2 jours", "Film 2–3 min + formats réseaux", "à partir de 1 800 €", 2),
                Service("Sport & event", ["Captation multi-focale", "Ralentis", "Sound design"], "Demi-journée à 2 jours", "Aftermovie 2 min + 3 formats verticaux", "à partir de 900 €", 3),
                Service("Clip & lifestyle", ["Direction artistique", "Tournage", "Montage rythmique"], "1 journée", "Clip complet + déclinaisons courtes", "à partir de 1 200 €", 4));
        }

        if (!await db.ProcessSteps.AnyAsync(cancellationToken))
        {
            db.ProcessSteps.AddRange(
                new ProcessStep { Id = Guid.NewGuid(), Index = "01", Title = "Échange", Body = "On cadre l’intention, le budget et la date. Devis sous 48 h.", SortOrder = 1 },
                new ProcessStep { Id = Guid.NewGuid(), Index = "02", Title = "Tournage", Body = "Repérage, plan de tournage, captation discrète et cadrée.", SortOrder = 2 },
                new ProcessStep { Id = Guid.NewGuid(), Index = "03", Title = "Livraison", Body = "Montage, étalonnage, deux allers-retours puis livraison en ligne.", SortOrder = 3 });
        }

        if (!await db.Testimonials.AnyAsync(cancellationToken))
        {
            db.Testimonials.AddRange(
                new Testimonial { Id = Guid.NewGuid(), Quote = "Témoignage à compléter depuis le backoffice.", Author = "Client·e", Role = "Mariage", SortOrder = 1 },
                new Testimonial { Id = Guid.NewGuid(), Quote = "Témoignage à compléter depuis le backoffice.", Author = "Client·e", Role = "Corporate", SortOrder = 2 },
                new Testimonial { Id = Guid.NewGuid(), Quote = "Témoignage à compléter depuis le backoffice.", Author = "Client·e", Role = "Sport", SortOrder = 3 });
        }

        await db.SaveChangesAsync(cancellationToken);

        await RenameLegacyBrandAsync(db, logger, cancellationToken);
        await FixLegacyLocationAsync(db, logger, cancellationToken);
        await EnsureNlTranslationsAsync(db, logger, cancellationToken);
        await AttachAmbienceFootageAsync(db, logger, cancellationToken);
    }

    /// <summary>
    /// Correspondance FR → NL pour les cinq catégories : slug et nom réels
    /// (utilisés dans les URL et la navigation), pas des lorem — un menu en
    /// faux-latin serait inutilisable, même à titre provisoire.
    /// </summary>
    private static readonly (string FrSlug, string NlSlug, string NlName)[] CategoryLocaleMap =
    [
        ("mariage", "huwelijk", "Huwelijk"),
        ("corporate", "zakelijk", "Zakelijk"),
        ("sport", "sport", "Sport"),
        ("clip", "clip", "Clip"),
        ("lifestyle", "lifestyle", "Lifestyle"),
    ];

    private const string LoremShort = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    private const string LoremLong =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

    /// <summary>
    /// Pose la version néerlandaise du contenu structurel (catégories,
    /// prestations, étapes, témoignages, réglages), une fois par élément
    /// français déjà en place. Les libellés qui déterminent une URL ou un
    /// intitulé de menu sont traduits pour de vrai ; tout le texte de
    /// contenu (accroches, descriptions, témoignages, "à propos") est posé
    /// en lorem ipsum, comme convenu, en attendant une vraie rédaction NL.
    /// Ne touche jamais une fiche NL déjà créée : une traduction saisie
    /// depuis le backoffice n'est jamais écrasée.
    /// </summary>
    private static async Task EnsureNlTranslationsAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        var created = 0;

        var frCategories = await db.Categories
            .Where(c => c.Locale == "fr")
            .ToListAsync(cancellationToken);
        var existingNlSlugs = await db.Categories
            .Where(c => c.Locale == "nl")
            .Select(c => c.Slug)
            .ToListAsync(cancellationToken);

        foreach (var (frSlug, nlSlug, nlName) in CategoryLocaleMap)
        {
            if (existingNlSlugs.Contains(nlSlug))
            {
                continue;
            }
            var fr = frCategories.FirstOrDefault(c => c.Slug == frSlug);
            if (fr is null)
            {
                continue;
            }
            db.Categories.Add(new Category
            {
                Id = Guid.NewGuid(),
                Slug = nlSlug,
                Name = nlName,
                Tagline = LoremShort,
                Locale = "nl",
                SortOrder = fr.SortOrder,
                ReelMediaId = fr.ReelMediaId,
                PosterMediaId = fr.PosterMediaId,
                IsPublished = fr.IsPublished,
                IsProtected = fr.IsProtected,
            });
            created++;
        }

        var frServices = await db.Services.Where(s => s.Locale == "fr").ToListAsync(cancellationToken);
        var existingNlServiceNames = await db.Services
            .Where(s => s.Locale == "nl")
            .Select(s => s.Name)
            .ToListAsync(cancellationToken);
        var serviceNameMap = new Dictionary<string, string>
        {
            ["Mariage"] = "Huwelijk",
            ["Corporate"] = "Zakelijk",
            ["Sport & event"] = "Sport & event",
            ["Clip & lifestyle"] = "Clip & lifestyle",
        };
        foreach (var fr in frServices)
        {
            var nlName = serviceNameMap.GetValueOrDefault(fr.Name, fr.Name);
            if (existingNlServiceNames.Contains(nlName))
            {
                continue;
            }
            db.Services.Add(new Service
            {
                Id = Guid.NewGuid(),
                Name = nlName,
                IncludedJson = DtoMapper.ToJson([LoremShort]),
                Duration = LoremShort,
                Deliverables = LoremShort,
                StartingPrice = fr.StartingPrice,
                Locale = "nl",
                SortOrder = fr.SortOrder,
            });
            created++;
        }

        var frSteps = await db.ProcessSteps.Where(p => p.Locale == "fr").ToListAsync(cancellationToken);
        var existingNlStepIndexes = await db.ProcessSteps
            .Where(p => p.Locale == "nl")
            .Select(p => p.Index)
            .ToListAsync(cancellationToken);
        foreach (var fr in frSteps)
        {
            if (existingNlStepIndexes.Contains(fr.Index))
            {
                continue;
            }
            db.ProcessSteps.Add(new ProcessStep
            {
                Id = Guid.NewGuid(),
                Index = fr.Index,
                Title = LoremShort,
                Body = LoremLong,
                Locale = "nl",
                SortOrder = fr.SortOrder,
            });
            created++;
        }

        var frTestimonials = await db.Testimonials.Where(t => t.Locale == "fr").ToListAsync(cancellationToken);
        var existingNlTestimonialRoles = await db.Testimonials
            .Where(t => t.Locale == "nl")
            .Select(t => t.Role)
            .ToListAsync(cancellationToken);
        var roleMap = new Dictionary<string, string>
        {
            ["Mariage"] = "Huwelijk",
            ["Corporate"] = "Zakelijk",
            ["Sport"] = "Sport",
        };
        foreach (var fr in frTestimonials)
        {
            var nlRole = roleMap.GetValueOrDefault(fr.Role, fr.Role);
            if (existingNlTestimonialRoles.Contains(nlRole))
            {
                continue;
            }
            db.Testimonials.Add(new Testimonial
            {
                Id = Guid.NewGuid(),
                Quote = LoremLong,
                Author = fr.Author,
                Role = nlRole,
                Locale = "nl",
                SortOrder = fr.SortOrder,
            });
            created++;
        }

        var frSettings = await db.SiteSettings.FirstOrDefaultAsync(s => s.Locale == "fr", cancellationToken);
        var nlSettingsExists = await db.SiteSettings.AnyAsync(s => s.Locale == "nl", cancellationToken);
        if (frSettings is not null && !nlSettingsExists)
        {
            db.SiteSettings.Add(new SiteSettings
            {
                // Id n'est pas auto-généré par EF ici (défaut C# = 1, jamais la
                // valeur CLR par défaut) : il faut le fixer nous-mêmes, sous
                // peine de collision avec la fiche FR.
                Id = 2,
                BrandName = frSettings.BrandName,
                Tagline = LoremShort,
                ShowreelMediaId = frSettings.ShowreelMediaId,
                Email = frSettings.Email,
                Instagram = frSettings.Instagram,
                City = "Brussel",
                Region = "Brussels Hoofdstedelijk Gewest",
                LegalText = LoremLong,
                AboutPortraitUrl = frSettings.AboutPortraitUrl,
                AboutParagraphsJson = DtoMapper.ToJson([LoremLong, LoremLong]),
                Locale = "nl",
            });
            created++;
        }

        if (created > 0)
        {
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation("{Count} fiche(s) néerlandaise(s) créée(s) (contenu provisoire).", created);
        }
    }

    /// <summary>
    /// Correction du même type que <see cref="RenameLegacyBrandAsync"/> : la
    /// ville/région de départ pointaient vers Lyon (contexte hérité, avant le
    /// passage à Bruxelles). Seules les valeurs restées à cet ancien défaut
    /// sont réécrites ; un texte modifié depuis le backoffice n'est jamais
    /// écrasé.
    /// </summary>
    private static async Task FixLegacyLocationAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        var settings = await db.SiteSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings is null)
        {
            return;
        }

        var fixedLocation = false;
        if (settings.City == "Lyon")
        {
            settings.City = "Bruxelles";
            fixedLocation = true;
        }
        if (settings.Region == "Auvergne-Rhône-Alpes")
        {
            settings.Region = "Bruxelles-Capitale";
            fixedLocation = true;
        }

        var paragraphs = DtoMapper.ParseStringList(settings.AboutParagraphsJson);
        if (paragraphs.Any(p => p.Contains("basé à Lyon", StringComparison.Ordinal)))
        {
            settings.AboutParagraphsJson = DtoMapper.ToJson(
                paragraphs.Select(p => p.Replace("basé à Lyon", "basé à Bruxelles", StringComparison.Ordinal)).ToList());
            fixedLocation = true;
        }

        if (fixedLocation)
        {
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Réglages de localisation repris sur Bruxelles.");
        }
    }

    /// <summary>
    /// Reprise de l'ancienne marque « Studio VNL » sur les bases déjà en
    /// service. Seules les valeurs restées à l'ancien défaut sont réécrites :
    /// un texte modifié depuis le backoffice n'est jamais écrasé.
    /// </summary>
    private static async Task RenameLegacyBrandAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        var settings = await db.SiteSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings is null)
        {
            return;
        }

        var renamed = false;
        if (settings.BrandName == "Studio VNL")
        {
            settings.BrandName = "Heaven Motion";
            renamed = true;
        }
        if (settings.Email == "contact@studiovnl.fr")
        {
            settings.Email = "contact@heavenmotion.be";
            renamed = true;
        }
        if (settings.Instagram == "@studiovnl")
        {
            settings.Instagram = "@heavenmotion";
            renamed = true;
        }
        if (settings.LegalText.StartsWith("Studio VNL", StringComparison.Ordinal))
        {
            settings.LegalText = settings.LegalText.Replace("Studio VNL", "Heaven Motion", StringComparison.Ordinal);
            renamed = true;
        }

        var paragraphs = DtoMapper.ParseStringList(settings.AboutParagraphsJson);
        if (paragraphs.Any(p => p.Contains("Studio VNL", StringComparison.Ordinal)))
        {
            settings.AboutParagraphsJson = DtoMapper.ToJson(
                paragraphs.Select(p => p.Replace("Studio VNL", "Heaven Motion", StringComparison.Ordinal)).ToList());
            renamed = true;
        }

        if (renamed)
        {
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Réglages repris à la marque Heaven Motion.");
        }
    }

    /// <summary>
    /// Pose une boucle d'ambiance sur les bandes et le showreel encore
    /// dépourvus de média — le site montre du mouvement en attendant les vraies
    /// vidéos. Dès qu'un fichier a été déposé dans la bibliothèque, plus aucune
    /// boucle n'est ajoutée : le contenu du studio reprend la main.
    /// </summary>
    private static async Task AttachAmbienceFootageAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        await RemoveDeadStockMediaAsync(db, logger, cancellationToken);

        // Un seul vrai fichier dans la bibliothèque suffit à couper la pose :
        // le studio a commencé à livrer, on ne complète plus.
        var hasUploadedMedia = await db.MediaAssets
            .AnyAsync(m => !m.OriginalPath.StartsWith("/ambience/"), cancellationToken);
        if (hasUploadedMedia)
        {
            return;
        }

        var attached = 0;
        var categories = await db.Categories
            .Where(c => c.ReelMediaId == null)
            .ToListAsync(cancellationToken);
        foreach (var category in categories)
        {
            if (!AmbienceFootage.ByCategorySlug.TryGetValue(category.Slug, out var clip))
            {
                continue;
            }
            var media = clip.ToMediaAsset();
            db.MediaAssets.Add(media);
            category.ReelMediaId = media.Id;
            attached++;
        }

        var settings = await db.SiteSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings is not null && settings.ShowreelMediaId is null)
        {
            var media = AmbienceFootage.Showreel.ToMediaAsset();
            db.MediaAssets.Add(media);
            settings.ShowreelMediaId = media.Id;
            attached++;
        }

        if (attached > 0)
        {
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation(
                "{Count} boucle(s) d'ambiance rattachée(s) en attendant les vraies vidéos.",
                attached);
        }
    }

    /// <summary>
    /// Retire les extraits de banque externes posés par une version précédente
    /// du seed : leurs URL ne répondent pas et les cadres restaient noirs. Les
    /// références sont d'abord détachées, puis les médias supprimés — rien
    /// d'autre que ces extraits n'est touché, un fichier déposé par le studio
    /// n'ayant jamais une URL absolue pour chemin d'origine.
    /// </summary>
    private static async Task RemoveDeadStockMediaAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        var dead = await db.MediaAssets
            .Where(m => m.OriginalPath.StartsWith("http"))
            .ToListAsync(cancellationToken);
        if (dead.Count == 0)
        {
            return;
        }

        var deadIds = dead.Select(m => m.Id).ToHashSet();

        foreach (var category in await db.Categories.ToListAsync(cancellationToken))
        {
            if (category.ReelMediaId is Guid reel && deadIds.Contains(reel))
            {
                category.ReelMediaId = null;
            }
            if (category.PosterMediaId is Guid poster && deadIds.Contains(poster))
            {
                category.PosterMediaId = null;
            }
        }

        foreach (var film in await db.Films.ToListAsync(cancellationToken))
        {
            if (film.MediaId is Guid media && deadIds.Contains(media))
            {
                film.MediaId = null;
            }
            if (film.PosterMediaId is Guid poster && deadIds.Contains(poster))
            {
                film.PosterMediaId = null;
            }
        }

        var settings = await db.SiteSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings?.ShowreelMediaId is Guid showreel && deadIds.Contains(showreel))
        {
            settings.ShowreelMediaId = null;
        }

        await db.SaveChangesAsync(cancellationToken);

        db.MediaAssets.RemoveRange(dead);
        await db.SaveChangesAsync(cancellationToken);
        logger.LogInformation("{Count} extrait(s) de banque externe retiré(s) : liens morts.", dead.Count);
    }

    private static async Task SeedRolesAndUsersAsync(IServiceProvider services, ILogger logger)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        foreach (var role in new[] { "Admin", "Editor" })
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var configuration = services.GetRequiredService<IConfiguration>();
        var adminEmail = configuration["Seed:AdminEmail"] ?? "admin@heavenmotion.be";
        var adminPassword = configuration["Seed:AdminPassword"];

        if (string.IsNullOrEmpty(adminPassword))
        {
            logger.LogWarning("Seed:AdminPassword absent : aucun compte admin créé.");
            return;
        }

        if (await userManager.FindByEmailAsync(adminEmail) is null)
        {
            var user = new AppUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
            var result = await userManager.CreateAsync(user, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Admin");
                logger.LogInformation("Compte admin {Email} créé.", adminEmail);
            }
            else
            {
                logger.LogError("Création du compte admin refusée : {Errors}",
                    string.Join("; ", result.Errors.Select(e => e.Description)));
            }
        }
    }

    private static List<Category> DefaultCategories() =>
    [
        Category("mariage", "Mariage", "Le film de votre journée, monté comme une scène de cinéma.", 1),
        Category("corporate", "Corporate", "Films de marque, portraits de métiers et captations d’événements.", 2),
        Category("sport", "Sport", "Athlètes, clubs et compétitions filmés au rythme de l’effort.", 3),
        Category("clip", "Clip", "Clips musicaux et formats courts à forte direction artistique.", 4),
        Category("lifestyle", "Lifestyle", "Vlogs, séries sociales et contenus de marque au quotidien.", 5),
    ];

    private static Category Category(string slug, string name, string tagline, int order) => new()
    {
        Id = Guid.NewGuid(),
        Slug = slug,
        Name = name,
        Tagline = tagline,
        SortOrder = order,
        IsPublished = true,
        IsProtected = true,
    };

    private static Service Service(
        string name,
        string[] included,
        string duration,
        string deliverables,
        string price,
        int order) => new()
    {
        Id = Guid.NewGuid(),
        Name = name,
        IncludedJson = DtoMapper.ToJson(included),
        Duration = duration,
        Deliverables = deliverables,
        StartingPrice = price,
        SortOrder = order,
    };
}
