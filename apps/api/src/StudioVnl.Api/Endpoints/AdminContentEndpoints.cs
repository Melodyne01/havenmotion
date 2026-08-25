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

    private static async Task<SiteSettingsDto> GetSettingsAsync(
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var settings = await LoadSettingsAsync(db, cancellationToken);
        return ToDto(settings, storage);
    }

    private static async Task<IResult> UpdateSettingsAsync(
        UpdateSettingsRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var settings = await LoadSettingsAsync(db, cancellationToken);
        settings.BrandName = request.BrandName;
        settings.Tagline = request.Tagline;
        settings.Email = request.Email;
        settings.Instagram = request.Instagram;
        settings.City = request.City;
        settings.Region = request.Region;
        settings.LegalText = request.LegalText;
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync(
            "SiteSettings", "1", "Update", JsonSerializer.Serialize(request), cancellationToken);
        return Results.Ok(ToDto(settings, storage));
    }

    private static async Task<IResult> SetShowreelAsync(
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

        var settings = await LoadSettingsAsync(db, cancellationToken);
        settings.ShowreelMediaId = media.Id;
        db.ShowreelHistory.Add(new ShowreelHistoryEntry
        {
            Id = Guid.NewGuid(),
            MediaId = media.Id,
            ActivatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync(
            "SiteSettings", "1", "SetShowreel", media.FileName, cancellationToken);

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

    private static async Task<SiteSettings> LoadSettingsAsync(
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var settings = await db.SiteSettings
            .Include(s => s.ShowreelMedia)
            .FirstOrDefaultAsync(cancellationToken);
        if (settings is null)
        {
            settings = new SiteSettings { Id = 1 };
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

    /// <summary>CRUD générique des blocs de contenu triés par `SortOrder`.</summary>
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

        group.MapGet("/", async (AppDbContext db, CancellationToken cancellationToken) =>
        {
            var entities = await set(db).AsNoTracking().ToListAsync(cancellationToken);
            return entities.OrderBy(sortKey).Select(toDto).ToList();
        });

        group.MapPost("/", async (
            TRequest request,
            AppDbContext db,
            IAuditTrail audit,
            CancellationToken cancellationToken) =>
        {
            var entity = new TEntity();
            SetId(entity, Guid.NewGuid());
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
