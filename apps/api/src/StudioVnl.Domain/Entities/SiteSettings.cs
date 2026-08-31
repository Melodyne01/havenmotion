namespace StudioVnl.Domain.Entities;

/// <summary>Réglages uniques du site (une seule ligne en base).</summary>
public class SiteSettings
{
    public int Id { get; set; } = 1;
    public string BrandName { get; set; } = "Heaven Motion";
    public string Tagline { get; set; } = string.Empty;
    public Guid? ShowreelMediaId { get; set; }
    public MediaAsset? ShowreelMedia { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Instagram { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string LegalText { get; set; } = string.Empty;
    public string AboutPortraitUrl { get; set; } = string.Empty;

    /// <summary>Paragraphes « À propos », sérialisés en JSON.</summary>
    public string AboutParagraphsJson { get; set; } = "[]";
}
