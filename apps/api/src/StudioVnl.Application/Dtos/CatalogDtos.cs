namespace StudioVnl.Application.Dtos;

public record CategoryDto(
    Guid Id,
    string Slug,
    string Name,
    string Tagline,
    int SortOrder,
    int FilmCount,
    bool IsPublished,
    MediaAssetDto? Reel,
    MediaAssetDto? Poster);

public record UpdateCategoryRequest(
    string Name,
    string Slug,
    string Tagline,
    int? FilmCount,
    bool IsPublished,
    MediaRefDto? Reel,
    MediaRefDto? Poster);

/// <summary>Référence à un média existant : seul l'identifiant compte à l'écriture.</summary>
public record MediaRefDto(Guid Id);

public record FilmDto(
    Guid Id,
    Guid CategoryId,
    string CategorySlug,
    string Title,
    string Client,
    string? Date,
    string Duration,
    string Description,
    int SortOrder,
    bool IsFeatured,
    string Status,
    MediaAssetDto? Media,
    MediaAssetDto? Poster);

public record SaveFilmRequest(
    Guid CategoryId,
    string Title,
    string Client,
    string? Date,
    string Duration,
    string Description,
    bool IsFeatured,
    string Status,
    MediaRefDto? Media,
    MediaRefDto? Poster);

public record ReorderRequest(IReadOnlyList<Guid> Ids);
