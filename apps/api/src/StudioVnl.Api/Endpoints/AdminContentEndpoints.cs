using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Endpoints;

/// <summary>Réglages, showreel et contenus texte du site.</summary>
public static class AdminContentEndpoints
{
    public static void MapAdminContentEndpoints(this RouteGroupBuilder admin)
    {
        var settings = admin.MapGroup("/settings").WithTags("Admin · Réglages");
        settings.MapGet("/", GetSettingsAsync);
        settings.MapPut("/", UpdateSettingsAsync)
            .AddEndpointFilter<ValidationFilter<UpdateSettingsRequest>>();
        settings.MapPut("/showreel", SetShowreelAsync);
        settings.MapGet("/showreel/history", ShowreelHistoryAsync);

        MapCrud<Service, ServiceDto, SaveServiceRequest>(
            admin, "/services", "Admin · Prestations",
            db => db.Services,
            entity => entity.ToDto(),
            (entity, request) =>
            {
                entity.Name = request.Name;
                entity.IncludedJson = DtoMapper.ToJson(request.Included.ToList());
                entity.Duration = request.Duration;
                entity.Deliverables = request.Deliverables;
                entity.StartingPrice = request.StartingPrice;
                entity.SortOrder = request.SortOrder;
            },
            entity => entity.SortOrder);

        MapCrud<ProcessStep, ProcessStepDto, SaveProcessStepRequest>(
            admin, "/process", "Admin · Process",
            db => db.ProcessSteps,
            entity => entity.ToDto(),
            (entity, request) =>
            {
                entity.Index = request.Index;
                entity.Title = request.Title;
                entity.Body = request.Body;
                entity.SortOrder = request.SortOrder;
            },
            entity => entity.SortOrder);

        MapCrud<Testimonial, TestimonialDto, SaveTestimonialRequest>(
            admin, "/testimonials", "Admin · Témoignages",
            db => db.Testimonials,
            entity => entity.ToDto(),
            (entity, request) =>
            {
                entity.Quote = request.Quote;
                entity.Author = request.Author;
                entity.Role = request.Role;
                entity.SortOrder = request.SortOrder;
            },
            entity => entity.SortOrder);

        MapCrud<ClientLogo, ClientLogoDto, SaveClientLogoRequest>(
            admin, "/logos", "Admin · Logos",
            db => db.ClientLogos,
            entity => entity.ToDto(),
            (entity, request) =>
            {
                entity.Name = request.Name;
                entity.ImageUrl = request.ImageUrl;
                entity.SortOrder = request.SortOrder;
            },
            entity => entity.SortOrder);
    }

    /// <summary>Langues supportées ; toute autre valeur retombe sur "fr".</summary>
    private static string NormalizeLocale(string? locale) => locale == "nl" ? "nl" : "fr";

    private static async Task<SiteSettingsDto> GetSettingsAsync(
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var settings = await LoadSettingsAsync(db, NormalizeLocale(locale), cancellationToken);
        return ToDto(settings, storage);
    }

    private static async Task<IResult> UpdateSettingsAsync(
        string? locale,
        UpdateSettingsRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);
        var settings = await LoadSettingsAsync(db, loc, cancellationToken);
        settings.BrandName = request.BrandName;
        settings.Tagline = request.Tagline;
        settings.Email = request.Email;
        settings.Instagram = request.Instagram;
        settings.City = request.City;
        settings.Region = request.Region;
        settings.LegalText = request.LegalText;
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync(
            "SiteSettings", loc, "Update", JsonSerializer.Serialize(request), cancellationToken);
        return Results.Ok(ToDto(settings, storage));
    }

    private static async Task<IResult> SetShowreelAsync(
        string? locale,
        SetShowreelRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var media = await db.MediaAssets
            .FirstOrDefaultAsync(a => a.Id == request.MediaId, cancellationToken);
        if (media is null || media.Kind != MediaKind.Video)
        {
            return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Vidéo introuvable.");
        }

        var loc = NormalizeLocale(locale);
        var settings = await LoadSettingsAsync(db, loc, cancellationToken);
        settings.ShowreelMediaId = media.Id;
        db.ShowreelHistory.Add(new ShowreelHistoryEntry
        {
            Id = Guid.NewGuid(),
            MediaId = media.Id,
            ActivatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync(
            "SiteSettings", loc, "SetShowreel", media.FileName, cancellationToken);

        settings.ShowreelMedia = media;
        return Results.Ok(ToDto(settings, storage));
    }

    private static async Task<IReadOnlyList<MediaAssetDto>> ShowreelHistoryAsync(
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var entries = await db.ShowreelHistory
            .Include(h => h.Media)
            .OrderByDescending(h => h.ActivatedAt)
            .AsNoTracking()
            .Take(20)
            .ToListAsync(cancellationToken);
        return entries
            .Where(h => h.Media is not null)
            .Select(h => h.Media!.ToDto(storage.GetPublicUrl))
            .ToList();
    }

    /// <summary>
    /// Avec deux fiches en base (FR = Id 1, NL = Id 2, posées par
    /// EnsureNlTranslationsAsync), lire "la" fiche sans filtre de langue
    /// renvoyait une ligne au hasard selon l'ordre du moteur — l'admin
    /// pouvait silencieusement modifier la mauvaise langue. Le filtre est
    /// donc obligatoire ici, pas une simple optimisation.
    /// </summary>
    private static async Task<SiteSettings> LoadSettingsAsync(
        AppDbContext db,
        string locale,
        CancellationToken cancellationToken)
    {
        var settings = await db.SiteSettings
            .Include(s => s.ShowreelMedia)
            .FirstOrDefaultAsync(s => s.Locale == locale, cancellationToken);
        if (settings is null)
        {
            settings = new SiteSettings { Id = locale == "nl" ? 2 : 1, Locale = locale };
            db.SiteSettings.Add(settings);
        }
        return settings;
    }

    private static SiteSettingsDto ToDto(SiteSettings settings, IMediaStorage storage) => new(
        settings.BrandName,
        settings.Tagline,
        settings.Email,
        settings.Instagram,
        settings.City,
        settings.Region,
        settings.LegalText,
        settings.ShowreelMedia?.ToDto(storage.GetPublicUrl));

    /// <summary>
    /// CRUD générique des blocs de contenu triés par `SortOrder`. Filtre par
    /// langue quand l'entité en a une (Service, ProcessStep, Testimonial) ;
    /// ClientLogo n'en a pas (noms de marque, pas de texte à traduire) et le
    /// filtre devient un no-op pour elle — même méthode générique pour les
    /// deux cas plutôt qu'un paramètre par appelant.
    /// </summary>
    private static void MapCrud<TEntity, TDto, TRequest>(
        RouteGroupBuilder admin,
        string prefix,
        string tag,
        Func<AppDbContext, DbSet<TEntity>> set,
        Func<TEntity, TDto> toDto,
        Action<TEntity, TRequest> apply,
        Func<TEntity, int> sortKey)
        where TEntity : class, new()
        where TRequest : class
    {
        var group = admin.MapGroup(prefix).WithTags(tag);
        var localeProperty = typeof(TEntity).GetProperty("Locale");

        group.MapGet("/", async (string? locale, AppDbContext db, CancellationToken cancellationToken) =>
        {
            IQueryable<TEntity> query = set(db).AsNoTracking();
            if (localeProperty is not null)
            {
                query = query.Where(e => EF.Property<string>(e, "Locale") == NormalizeLocale(locale));
            }
            var entities = await query.ToListAsync(cancellationToken);
            return entities.OrderBy(sortKey).Select(toDto).ToList();
        });

        group.MapPost("/", async (
            string? locale,
            TRequest request,
            AppDbContext db,
            IAuditTrail audit,
            CancellationToken cancellationToken) =>
        {
            var entity = new TEntity();
            SetId(entity, Guid.NewGuid());
            localeProperty?.SetValue(entity, NormalizeLocale(locale));
            apply(entity, request);
            set(db).Add(entity);
            await db.SaveChangesAsync(cancellationToken);
            await audit.RecordAsync(
                typeof(TEntity).Name, GetId(entity), "Create",
                JsonSerializer.Serialize(request), cancellationToken);
            return Results.Ok(toDto(entity));
        }).AddEndpointFilter<ValidationFilter<TRequest>>();

        group.MapPut("/{id:guid}", async (
            Guid id,
            TRequest request,
            AppDbContext db,
            IAuditTrail audit,
            CancellationToken cancellationToken) =>
        {
            var entity = await set(db).FindAsync([id], cancellationToken);
            if (entity is null)
            {
                return Results.NotFound();
            }
            apply(entity, request);
            await db.SaveChangesAsync(cancellationToken);
            await audit.RecordAsync(
                typeof(TEntity).Name, id.ToString(), "Update",
                JsonSerializer.Serialize(request), cancellationToken);
            return Results.Ok(toDto(entity));
        }).AddEndpointFilter<ValidationFilter<TRequest>>();

        group.MapDelete("/{id:guid}", async (
            Guid id,
            AppDbContext db,
            IAuditTrail audit,
            CancellationToken cancellationToken) =>
        {
            var entity = await set(db).FindAsync([id], cancellationToken);
            if (entity is null)
            {
                return Results.NotFound();
            }
            set(db).Remove(entity);
            await db.SaveChangesAsync(cancellationToken);
            await audit.RecordAsync(typeof(TEntity).Name, id.ToString(), "Delete", string.Empty, cancellationToken);
            return Results.NoContent();
        });
    }

    private static void SetId<TEntity>(TEntity entity, Guid id) =>
        typeof(TEntity).GetProperty("Id")!.SetValue(entity, id);

    private static string GetId<TEntity>(TEntity entity) =>
        typeof(TEntity).GetProperty("Id")!.GetValue(entity)?.ToString() ?? string.Empty;
}
