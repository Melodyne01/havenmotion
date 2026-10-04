namespace StudioVnl.Application.Dtos;

/// <summary>Texte d'un projet dans une langue ; `null` quand la langue n'est pas remplie.</summary>
public record ProjectTextDto(string Title, string Summary, IReadOnlyList<string> Paragraphs);

public record ProjectDto(
    Guid Id,
    string Slug,
    string CategoryKey,
    string RegionId,
    string Venue,
    string City,
    string CountryCode,
    string? Date,
    string Pack,
    ProjectTextDto? Fr,
    ProjectTextDto? Nl,
    ProjectTextDto? En,
    MediaAssetDto? Cover,
    MediaAssetDto? Video,
    IReadOnlyList<MediaAssetDto> Gallery,
    bool IsFeatured,
    int SortOrder,
    string Status,
    DateTime CreatedAt);

/// <summary>Texte d'un projet dans une langue, à l'enregistrement : titre, résumé, récit brut (paragraphes séparés par une ligne vide).</summary>
public record ProjectTextRequest(string Title, string Summary, string Body);

public record SaveProjectRequest(
    string Slug,
    string CategoryKey,
    string RegionId,
    string Venue,
    string City,
    string CountryCode,
    string? Date,
    string Pack,
    ProjectTextRequest Fr,
    ProjectTextRequest Nl,
    ProjectTextRequest En,
    MediaRefDto? Cover,
    MediaRefDto? Video,
    IReadOnlyList<Guid> Gallery,
    bool IsFeatured,
    string Status);

public record ReviewDto(
    Guid Id,
    string Author,
    string City,
    string CategoryKey,
    int Rating,
    string Locale,
    string Quote,
    string? Date,
    string Source,
    Guid? ProjectId,
    bool IsPublished,
    int SortOrder);

public record SaveReviewRequest(
    string Author,
    string City,
    string CategoryKey,
    int Rating,
    string Locale,
    string Quote,
    string? Date,
    string Source,
    Guid? ProjectId,
    bool IsPublished,
    int SortOrder);
