using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Endpoints;

/// <summary>Catégories et films : le cœur du backoffice.</summary>
public static class AdminCatalogEndpoints
{
    public static void MapAdminCatalogEndpoints(this RouteGroupBuilder admin)
    {
        var categories = admin.MapGroup("/categories").WithTags("Admin · Catégories");
        categories.MapGet("/", ListCategoriesAsync);
        categories.MapPut("/reorder", ReorderCategoriesAsync);
        categories.MapPut("/{id:guid}", UpdateCategoryAsync)
            .AddEndpointFilter<ValidationFilter<UpdateCategoryRequest>>();

        var films = admin.MapGroup("/films").WithTags("Admin · Films");
        films.MapGet("/", ListFilmsAsync);
        films.MapPost("/", CreateFilmAsync).AddEndpointFilter<ValidationFilter<SaveFilmRequest>>();
        films.MapPut("/reorder", ReorderFilmsAsync);
        films.MapPut("/{id:guid}", UpdateFilmAsync).AddEndpointFilter<ValidationFilter<SaveFilmRequest>>();
        films.MapDelete("/{id:guid}", DeleteFilmAsync);
    }

    /// <summary>Langues supportées ; toute autre valeur retombe sur "fr".</summary>
    private static string NormalizeLocale(string? locale) => locale == "nl" ? "nl" : "fr";

    private static async Task<IReadOnlyList<CategoryDto>> ListCategoriesAsync(
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);

        var categories = await db.Categories
            .Include(c => c.ReelMedia)
            .Include(c => c.PosterMedia)
            .Where(c => c.Locale == loc)
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

    private static async Task<IResult> UpdateCategoryAsync(
        Guid id,
        UpdateCategoryRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var category = await db.Categories
            .Include(c => c.ReelMedia)
            .Include(c => c.PosterMedia)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (category is null)
        {
            return Results.NotFound();
        }

        // Le slug n'a besoin d'être unique que dans sa propre langue : Sport,
        // Clip et Lifestyle partagent volontairement le même slug en FR et en
        // NL (ce sont les mêmes mots dans les deux langues).
        var slugTaken = await db.Categories
            .AnyAsync(c => c.Id != id && c.Slug == request.Slug && c.Locale == category.Locale, cancellationToken);
        if (slugTaken)
        {
            return Results.Problem(statusCode: StatusCodes.Status409Conflict, title: "Ce slug est déjà utilisé.");
        }

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.Tagline = request.Tagline;
        category.FilmCountOverride = request.FilmCount;
        category.IsPublished = request.IsPublished;
        category.ReelMediaId = request.Reel?.Id;
        category.PosterMediaId = request.Poster?.Id;
        await db.SaveChangesAsync(cancellationToken);

        await audit.RecordAsync(
            "Category", id.ToString(), "Update", JsonSerializer.Serialize(request), cancellationToken);

        var reloaded = await db.Categories
            .Include(c => c.ReelMedia)
            .Include(c => c.PosterMedia)
            .AsNoTracking()
            .FirstAsync(c => c.Id == id, cancellationToken);
        var count = await db.Films
            .CountAsync(f => f.CategoryId == id && f.Status == PublishStatus.Published, cancellationToken);
        return Results.Ok(reloaded.ToDto(storage.GetPublicUrl, count));
    }

    private static async Task<IResult> ReorderCategoriesAsync(
        ReorderRequest request,
        AppDbContext db,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var categories = await db.Categories.ToListAsync(cancellationToken);
        var order = request.Ids.Select((categoryId, index) => (categoryId, index))
            .ToDictionary(x => x.categoryId, x => x.index);

        foreach (var category in categories)
        {
            if (order.TryGetValue(category.Id, out var index))
            {
                category.SortOrder = index + 1;
            }
        }
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync(
            "Category", "*", "Reorder", string.Join(",", request.Ids), cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IReadOnlyList<FilmDto>> ListFilmsAsync(
        Guid? categoryId,
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var query = db.Films
            .Include(f => f.Category)
            .Include(f => f.Media)
            .Include(f => f.PosterMedia)
            .AsNoTracking();
        if (categoryId.HasValue)
        {
            query = query.Where(f => f.CategoryId == categoryId.Value);
        }
        else if (locale is not null)
        {
            // Pas de catégorie précisée : la langue filtre la liste complète
            // (un film n'a pas sa propre langue, elle vient de sa catégorie).
            var loc = NormalizeLocale(locale);
            query = query.Where(f => f.Category!.Locale == loc);
        }
        var films = await query.OrderBy(f => f.SortOrder).ToListAsync(cancellationToken);
        return films.Select(f => f.ToDto(storage.GetPublicUrl)).ToList();
    }

    private static async Task<IResult> CreateFilmAsync(
        SaveFilmRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        if (!await db.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken))
        {
            return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Catégorie inconnue.");
        }

        var film = new Film { Id = Guid.NewGuid() };
        Apply(film, request);
        film.SortOrder = 1 + await db.Films.CountAsync(f => f.CategoryId == request.CategoryId, cancellationToken);
        db.Films.Add(film);
        await db.SaveChangesAsync(cancellationToken);

        await audit.RecordAsync(
            "Film", film.Id.ToString(), "Create", JsonSerializer.Serialize(request), cancellationToken);
        return Results.Created($"/api/admin/films/{film.Id}", await LoadDtoAsync(film.Id, db, storage, cancellationToken));
    }

    private static async Task<IResult> UpdateFilmAsync(
        Guid id,
        SaveFilmRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var film = await db.Films.FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        if (film is null)
        {
            return Results.NotFound();
        }

        Apply(film, request);
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync(
            "Film", id.ToString(), "Update", JsonSerializer.Serialize(request), cancellationToken);
        return Results.Ok(await LoadDtoAsync(id, db, storage, cancellationToken));
    }

    private static async Task<IResult> DeleteFilmAsync(
        Guid id,
        AppDbContext db,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var deleted = await db.Films.Where(f => f.Id == id).ExecuteDeleteAsync(cancellationToken);
        if (deleted == 0)
        {
            return Results.NotFound();
        }
        await audit.RecordAsync("Film", id.ToString(), "Delete", string.Empty, cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IResult> ReorderFilmsAsync(
        ReorderRequest request,
        AppDbContext db,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var films = await db.Films
            .Where(f => request.Ids.Contains(f.Id))
            .ToListAsync(cancellationToken);
        var order = request.Ids.Select((filmId, index) => (filmId, index))
            .ToDictionary(x => x.filmId, x => x.index);

        foreach (var film in films)
        {
            film.SortOrder = order[film.Id] + 1;
        }
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync("Film", "*", "Reorder", string.Join(",", request.Ids), cancellationToken);
        return Results.NoContent();
    }

    private static void Apply(Film film, SaveFilmRequest request)
    {
        film.CategoryId = request.CategoryId;
        film.Title = request.Title;
        film.Client = request.Client;
        film.Date = string.IsNullOrEmpty(request.Date)
            ? null
            : DateOnly.ParseExact(request.Date, "yyyy-MM-dd");
        film.Duration = request.Duration;
        film.Description = request.Description;
        film.IsFeatured = request.IsFeatured;
        film.Status = Enum.Parse<PublishStatus>(request.Status);
        film.MediaId = request.Media?.Id;
        film.PosterMediaId = request.Poster?.Id;
    }

    private static async Task<FilmDto> LoadDtoAsync(
        Guid id,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var film = await db.Films
            .Include(f => f.Category)
            .Include(f => f.Media)
            .Include(f => f.PosterMedia)
            .AsNoTracking()
            .FirstAsync(f => f.Id == id, cancellationToken);
        return film.ToDto(storage.GetPublicUrl);
    }
}
