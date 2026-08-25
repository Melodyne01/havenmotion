using StudioVnl.Domain.Entities;

namespace StudioVnl.Application.Dtos;

/// <summary>Rendu transcodé exposé au front (`type`, `url`, dimensions, muet).</summary>
public record RenditionDto(string Type, string Url, int Width, int Height, bool Muted);

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
    DateTime CreatedAt);

public record StartUploadRequest(string FileName, string ContentType, long SizeBytes, int TotalChunks);

public record StartUploadResponse(Guid UploadId);
