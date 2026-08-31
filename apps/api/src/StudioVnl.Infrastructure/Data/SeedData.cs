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
/// des extraits de banque vidéo sur les emplacements encore vides.
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
                City = "Lyon",
                Region = "Auvergne-Rhône-Alpes",
                LegalText = "Heaven Motion — micro-entreprise. Mentions légales à compléter.",
                AboutPortraitUrl = "/placeholders/portrait.svg",
                AboutParagraphsJson = DtoMapper.ToJson(
                [
                    "Heaven Motion est un studio vidéo indépendant basé à Lyon.",
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
        await AttachStockFootageAsync(db, logger, cancellationToken);
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
    /// Pose un extrait de banque vidéo sur les bandes et le showreel encore
    /// dépourvus de média — le site montre du mouvement en attendant les vraies
    /// vidéos. Dès qu'un fichier a été déposé dans la bibliothèque, plus aucun
    /// extrait n'est ajouté : le contenu du studio reprend la main.
    /// </summary>
    private static async Task AttachStockFootageAsync(
        AppDbContext db,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        var hasUploadedMedia = await db.MediaAssets
            .AnyAsync(m => !m.OriginalPath.StartsWith("http"), cancellationToken);
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
            if (!StockFootage.ByCategorySlug.TryGetValue(category.Slug, out var clip))
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
            var media = StockFootage.Showreel.ToMediaAsset();
            db.MediaAssets.Add(media);
            settings.ShowreelMediaId = media.Id;
            attached++;
        }

        if (attached > 0)
        {
            await db.SaveChangesAsync(cancellationToken);
            logger.LogInformation(
                "{Count} extrait(s) de banque vidéo rattaché(s) en attendant les vraies vidéos.",
                attached);
        }
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
