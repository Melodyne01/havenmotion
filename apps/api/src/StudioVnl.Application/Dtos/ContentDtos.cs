namespace StudioVnl.Application.Dtos;

public record ServiceDto(
    Guid Id,
    string Name,
    IReadOnlyList<string> Included,
    string Duration,
    string Deliverables,
    string StartingPrice,
    int SortOrder);

public record SaveServiceRequest(
    string Name,
    IReadOnlyList<string> Included,
    string Duration,
    string Deliverables,
    string StartingPrice,
    int SortOrder);

public record ProcessStepDto(Guid Id, string Index, string Title, string Body, int SortOrder);

public record SaveProcessStepRequest(string Index, string Title, string Body, int SortOrder);

public record TestimonialDto(Guid Id, string Quote, string Author, string Role, int SortOrder);

public record SaveTestimonialRequest(string Quote, string Author, string Role, int SortOrder);

public record ClientLogoDto(Guid Id, string Name, string? ImageUrl, int SortOrder);

public record SaveClientLogoRequest(string Name, string? ImageUrl, int SortOrder);

public record AboutDto(string? PortraitUrl, IReadOnlyList<string> Paragraphs);

public record SiteSettingsDto(
    string BrandName,
    string Tagline,
    string Email,
    string Instagram,
    string City,
    string Region,
    string LegalText,
    MediaAssetDto? Showreel);

public record UpdateSettingsRequest(
    string BrandName,
    string Tagline,
    string Email,
    string Instagram,
    string City,
    string Region,
    string LegalText);

public record SetShowreelRequest(Guid MediaId);

public record SitePayloadDto(
    SiteSettingsDto Settings,
    IReadOnlyList<ServiceDto> Services,
    IReadOnlyList<ProcessStepDto> Process,
    AboutDto About,
    IReadOnlyList<TestimonialDto> Testimonials,
    IReadOnlyList<ClientLogoDto> Logos);
