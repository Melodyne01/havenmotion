using StudioVnl.Domain.Entities;

namespace StudioVnl.Application.Abstractions;

/// <summary>File de traitement vidéo (FFmpeg) exécutée en arrière-plan.</summary>
public interface IVideoProcessingQueue
{
    ValueTask EnqueueAsync(Guid mediaAssetId, CancellationToken cancellationToken);
}

/// <summary>Résultat d'un transcodage.</summary>
public record ProcessedVideo(
    IReadOnlyList<ProcessedRendition> Renditions,
    string PosterKey,
    int Width,
    int Height,
    double DurationSec);

public record ProcessedRendition(string Type, string Key, int Width, int Height, bool Muted);

/// <summary>Enveloppe FFmpeg : transcodage MP4/WebM, poster à 1 s, version muette.</summary>
public interface IVideoTranscoder
{
    Task<ProcessedVideo> ProcessAsync(MediaAsset asset, CancellationToken cancellationToken);
}
