namespace StudioVnl.Domain.Entities;

/// <summary>Fichier déposé dans la bibliothèque (vidéo ou image) et ses rendus.</summary>
public class MediaAsset
{
    public Guid Id { get; set; }
    public MediaKind Kind { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string OriginalPath { get; set; } = string.Empty;

    /// <summary>Rendus transcodés, sérialisés en JSON (type, url, dimensions, muet).</summary>
    public string RenditionsJson { get; set; } = "[]";

    public string? PosterPath { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public double DurationSec { get; set; }
    public long SizeBytes { get; set; }
    public ProcessingStatus ProcessingStatus { get; set; } = ProcessingStatus.Pending;

    /// <summary>
    /// Texte alternatif d'une image, par langue : ce que lisent Google Images et
    /// les lecteurs d'écran. Vide = le site retombe sur le titre de la page.
    /// </summary>
    public string AltFr { get; set; } = string.Empty;
    public string AltNl { get; set; } = string.Empty;
    public string AltEn { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
