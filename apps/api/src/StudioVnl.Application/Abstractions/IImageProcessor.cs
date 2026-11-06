using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Application.Abstractions;

/// <summary>
/// Résultat de l'optimisation d'une photo : déclinaisons WebP par largeur
/// (pour `srcset`), image de partage JPEG (Open Graph) et dimensions après
/// redressement.
/// </summary>
public record ProcessedImage(
    IReadOnlyList<ProcessedRendition> Renditions,
    string ShareImageKey,
    int Width,
    int Height);

/// <summary>Photo refusée : fichier illisible, format non décodable ou dimensions démesurées.</summary>
public class InvalidMediaException(string message, Exception? inner = null) : Exception(message, inner);

/// <summary>Optimisation des photos déposées dans la bibliothèque (ImageSharp).</summary>
public interface IImageProcessor
{
    /// <summary>
    /// Décline l'original de <paramref name="asset"/> pour le web.
    /// Lève <see cref="InvalidMediaException"/> si le fichier n'est pas une image exploitable.
    /// </summary>
    Task<ProcessedImage> ProcessAsync(MediaAsset asset, CancellationToken cancellationToken);
}

public static class MediaProcessing
{
    /// <summary>Original conservé dans le stockage : seul ce cas peut être (re)traité.</summary>
    public static bool HasStoredOriginal(MediaAsset asset) =>
        asset.OriginalPath.StartsWith("originals/", StringComparison.Ordinal);

    /// <summary>
    /// Photo que le serveur sait décliner. L'AVIF est déjà un format web
    /// compact, qu'ImageSharp ne décode pas : il est servi tel quel.
    /// </summary>
    public static bool IsOptimizableImage(MediaAsset asset) =>
        asset.Kind == MediaKind.Image
        && HasStoredOriginal(asset)
        && !asset.OriginalPath.EndsWith(".avif", StringComparison.OrdinalIgnoreCase);

    /// <summary>Photo optimisable qui n'a encore aucune déclinaison (déposée avant l'optimisation, ou en échec).</summary>
    public static bool IsUnoptimizedImage(MediaAsset asset) =>
        IsOptimizableImage(asset) && DtoMapper.ParseRenditions(asset.RenditionsJson, key => key).Count == 0;

    /// <summary>Enregistre sur l'asset le résultat de l'optimisation : il est prêt.</summary>
    public static void Apply(this MediaAsset asset, ProcessedImage result)
    {
        asset.RenditionsJson = DtoMapper.ToRenditionsJson(
            result.Renditions.Select(r => new DtoMapper.StoredRendition(r.Type, r.Key, r.Width, r.Height, r.Muted, r.Teaser)));
        asset.PosterPath = result.ShareImageKey;
        asset.Width = result.Width;
        asset.Height = result.Height;
        asset.ProcessingStatus = ProcessingStatus.Ready;
    }
}
