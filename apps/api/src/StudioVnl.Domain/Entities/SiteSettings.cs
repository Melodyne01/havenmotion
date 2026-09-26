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

    /// <summary>
    /// Langue de cette fiche de réglages ("fr" ou "nl"). BrandName, Email,
    /// Instagram, ShowreelMediaId et AboutPortraitUrl sont l'identité de la
    /// marque et devraient rester identiques entre les deux fiches — c'est à
    /// l'admin de les garder synchronisés pour l'instant, rien ne l'impose
    /// techniquement.
    /// </summary>
    public string Locale { get; set; } = "fr";
}
