using System.Text.Json;
using StudioVnl.Application.Dtos;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Application.Mapping;

/// <summary>
/// Projections entité → DTO. Mapping explicite : le contrat exposé au front
/// reste stable même quand le modèle interne bouge.
/// </summary>
public static class DtoMapper
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    public static IReadOnlyList<string> ParseStringList(string json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }
        try
        {
            return JsonSerializer.Deserialize<List<string>>(json, Json) ?? [];
        }
        catch (JsonException)
        {
            return [];
        }
    }

    public static string ToJson(IReadOnlyList<string> values) => JsonSerializer.Serialize(values, Json);

    public static IReadOnlyList<RenditionDto> ParseRenditions(string json, Func<string, string> resolveUrl)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }
        try
        {
            var stored = JsonSerializer.Deserialize<List<StoredRendition>>(json, Json) ?? [];
            return stored
                .Select(r => new RenditionDto(r.Type, resolveUrl(r.Key), r.Width, r.Height, r.Muted))
                .ToList();
        }
        catch (JsonException)
        {
            return [];
        }
    }

    public static string ToRenditionsJson(IEnumerable<StoredRendition> renditions) =>
        JsonSerializer.Serialize(renditions, Json);

    public static MediaAssetDto ToDto(this MediaAsset asset, Func<string, string> resolveUrl) => new(
        asset.Id,
        asset.Kind.ToString(),
        asset.FileName,
        asset.PosterPath is null ? null : resolveUrl(asset.PosterPath),
        asset.Width,
        asset.Height,
        asset.DurationSec,
        asset.SizeBytes,
        asset.ProcessingStatus.ToString(),
        ParseRenditions(asset.RenditionsJson, resolveUrl),
        asset.CreatedAt);

    public static CategoryDto ToDto(this Category category, Func<string, string> resolveUrl, int publishedFilmCount) => new(
        category.Id,
        category.Slug,
        category.Name,
        category.Tagline,
        category.SortOrder,
        category.FilmCountOverride ?? publishedFilmCount,
        category.IsPublished,
        category.ReelMedia?.ToDto(resolveUrl),
        category.PosterMedia?.ToDto(resolveUrl));

    public static FilmDto ToDto(this Film film, Func<string, string> resolveUrl) => new(
        film.Id,
        film.CategoryId,
        film.Category?.Slug ?? string.Empty,
        film.Title,
        film.Client,
        film.Date?.ToString("yyyy-MM-dd"),
        film.Duration,
        film.Description,
        film.SortOrder,
        film.IsFeatured,
        film.Status.ToString(),
        film.Media?.ToDto(resolveUrl),
        film.PosterMedia?.ToDto(resolveUrl));

    public static ServiceDto ToDto(this Service service) => new(
        service.Id,
        service.Name,
        ParseStringList(service.IncludedJson),
        service.Duration,
        service.Deliverables,
        service.StartingPrice,
        service.SortOrder);

    public static ProcessStepDto ToDto(this ProcessStep step) =>
        new(step.Id, step.Index, step.Title, step.Body, step.SortOrder);

    public static TestimonialDto ToDto(this Testimonial testimonial) =>
        new(testimonial.Id, testimonial.Quote, testimonial.Author, testimonial.Role, testimonial.SortOrder);

    public static ClientLogoDto ToDto(this ClientLogo logo) =>
        new(logo.Id, logo.Name, logo.ImageUrl, logo.SortOrder);

    public static LeadDto ToDto(this Lead lead) => new(
        lead.Id,
        lead.Name,
        lead.Email,
        lead.ProjectType,
        lead.EventDate?.ToString("yyyy-MM-dd"),
        lead.BudgetRange,
        lead.Message,
        lead.Status.ToString(),
        lead.CreatedAt,
        lead.UserAgent);

    public static AuditLogDto ToDto(this AuditLogEntry entry) => new(
        entry.Id,
        entry.UserEmail,
        entry.Entity,
        entry.EntityId,
        entry.Action,
        entry.Diff,
        entry.CreatedAt);

    /// <summary>Forme stockée d'un rendu dans `MediaAsset.RenditionsJson`.</summary>
    public record StoredRendition(string Type, string Key, int Width, int Height, bool Muted);
}
