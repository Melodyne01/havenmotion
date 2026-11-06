using StudioVnl.Domain.Entities;

namespace StudioVnl.Application.Dtos;

/// <summary>Rendu transcodé exposé au front (`type`, `url`, dimensions, muet).</summary>
public record RenditionDto(string Type, string Url, int Width, int Height, bool Muted, bool Teaser = false);

public record MediaAssetDto(
    Guid Id,
    string Kind,
    string FileName,
    string? PosterUrl,
    int Width,
    int Height,
    double DurationSec,
    long SizeBytes,
    string ProcessingStatus,
    IReadOnlyList<RenditionDto> Renditions,
    DateTime CreatedAt,
    MediaAltDto Alt);

/// <summary>Texte alternatif d'une image dans les trois langues du site (chaîne vide si non renseigné).</summary>
public record MediaAltDto(string Fr, string Nl, string En);

/// <summary>Mise à jour du texte alternatif d'un média.</summary>
public record UpdateMediaAltRequest(string Fr, string Nl, string En);

/// <summary>Nombre de médias mis en file de traitement.</summary>
public record ReprocessResponse(int Queued);

public record StartUploadRequest(string FileName, string ContentType, long SizeBytes, int TotalChunks);

public record StartUploadResponse(Guid UploadId);
