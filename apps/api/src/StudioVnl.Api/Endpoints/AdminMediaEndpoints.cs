using Microsoft.EntityFrameworkCore;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Endpoints;

/// <summary>Bibliothèque de médias et upload par morceaux.</summary>
public static class AdminMediaEndpoints
{
    public static void MapAdminMediaEndpoints(this RouteGroupBuilder admin)
    {
        var media = admin.MapGroup("/media").WithTags("Admin · Médias");
        media.MapGet("/", ListAsync);
        media.MapGet("/{id:guid}", GetAsync);
        media.MapDelete("/{id:guid}", DeleteAsync);

        media.MapPost("/uploads", StartUploadAsync)
            .AddEndpointFilter<ValidationFilter<StartUploadRequest>>();
        media.MapPut("/uploads/{uploadId:guid}/chunks/{index:int}", ReceiveChunkAsync)
            .DisableAntiforgery();
        media.MapPost("/uploads/{uploadId:guid}/complete", CompleteUploadAsync);
    }

    private static async Task<IReadOnlyList<MediaAssetDto>> ListAsync(
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var assets = await db.MediaAssets.AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
        return assets.Select(a => a.ToDto(storage.GetPublicUrl)).ToList();
    }

    private static async Task<IResult> GetAsync(
        Guid id,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var asset = await db.MediaAssets.AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        return asset is null ? Results.NotFound() : Results.Ok(asset.ToDto(storage.GetPublicUrl));
    }

    private static async Task<IResult> DeleteAsync(
        Guid id,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var inUse =
            await db.Categories.AnyAsync(c => c.ReelMediaId == id || c.PosterMediaId == id, cancellationToken)
            || await db.Films.AnyAsync(f => f.MediaId == id || f.PosterMediaId == id, cancellationToken)
            || await db.SiteSettings.AnyAsync(s => s.ShowreelMediaId == id, cancellationToken);
        if (inUse)
        {
            return Results.Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "Ce média est encore utilisé par une bande, un film ou le showreel.");
        }

        var asset = await db.MediaAssets.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (asset is null)
        {
            return Results.NotFound();
        }

        await storage.DeleteAsync(asset.OriginalPath, cancellationToken);
        foreach (var rendition in DtoMapper.ParseRenditions(asset.RenditionsJson, key => key))
        {
            await storage.DeleteAsync(rendition.Url, cancellationToken);
        }
        if (asset.PosterPath is not null)
        {
            await storage.DeleteAsync(asset.PosterPath, cancellationToken);
        }

        db.MediaAssets.Remove(asset);
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync("MediaAsset", id.ToString(), "Delete", asset.FileName, cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IResult> StartUploadAsync(
        StartUploadRequest request,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var session = new UploadSession
        {
            Id = Guid.NewGuid(),
            FileName = Path.GetFileName(request.FileName),
            ContentType = request.ContentType,
            SizeBytes = request.SizeBytes,
            TotalChunks = request.TotalChunks,
            CreatedAt = DateTime.UtcNow,
        };
        db.UploadSessions.Add(session);
        await db.SaveChangesAsync(cancellationToken);
        return Results.Ok(new StartUploadResponse(session.Id));
    }

    private static async Task<IResult> ReceiveChunkAsync(
        Guid uploadId,
        int index,
        HttpRequest request,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var session = await db.UploadSessions
            .FirstOrDefaultAsync(s => s.Id == uploadId, cancellationToken);
        if (session is null)
        {
            return Results.NotFound();
        }
        if (index < 0 || index >= session.TotalChunks)
        {
            return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Index de morceau invalide.");
        }

        var form = await request.ReadFormAsync(cancellationToken);
        var chunk = form.Files["chunk"];
        if (chunk is null)
        {
            return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Morceau manquant.");
        }

        await using var content = chunk.OpenReadStream();
        await storage.SaveAsync($"uploads/{uploadId:N}/{index:D5}.part", content, cancellationToken);

        session.ReceivedChunks = Math.Max(session.ReceivedChunks, index + 1);
        await db.SaveChangesAsync(cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IResult> CompleteUploadAsync(
        Guid uploadId,
        AppDbContext db,
        IMediaStorage storage,
        IVideoProcessingQueue queue,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var session = await db.UploadSessions
            .FirstOrDefaultAsync(s => s.Id == uploadId, cancellationToken);
        if (session is null)
        {
            return Results.NotFound();
        }
        if (session.ReceivedChunks < session.TotalChunks)
        {
            return Results.Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: $"Morceaux manquants : {session.ReceivedChunks}/{session.TotalChunks} reçus.");
        }

        var isVideo = session.ContentType.StartsWith("video/", StringComparison.Ordinal);
        var assetId = Guid.NewGuid();
        var extension = Path.GetExtension(session.FileName);
        var originalKey = $"originals/{assetId:N}{extension}";

        // Assemblage des morceaux dans l'ordre.
        var assembled = Path.Combine(Path.GetTempPath(), $"vnl-upload-{uploadId:N}");
        await using (var target = File.Create(assembled))
        {
            for (var index = 0; index < session.TotalChunks; index++)
            {
                await using var part = await storage.OpenReadAsync(
                    $"uploads/{uploadId:N}/{index:D5}.part", cancellationToken);
                await part.CopyToAsync(target, cancellationToken);
            }
        }

        try
        {
            await using (var source = File.OpenRead(assembled))
            {
                await storage.SaveAsync(originalKey, source, cancellationToken);
            }
        }
        finally
        {
            File.Delete(assembled);
        }

        for (var index = 0; index < session.TotalChunks; index++)
        {
            await storage.DeleteAsync($"uploads/{uploadId:N}/{index:D5}.part", cancellationToken);
        }

        var asset = new MediaAsset
        {
            Id = assetId,
            Kind = isVideo ? MediaKind.Video : MediaKind.Image,
            FileName = session.FileName,
            OriginalPath = originalKey,
            SizeBytes = session.SizeBytes,
            // Une image est prête telle quelle ; une vidéo part au transcodage.
            ProcessingStatus = isVideo ? ProcessingStatus.Pending : ProcessingStatus.Ready,
            PosterPath = isVideo ? null : originalKey,
            CreatedAt = DateTime.UtcNow,
        };
        db.MediaAssets.Add(asset);
        db.UploadSessions.Remove(session);
        await db.SaveChangesAsync(cancellationToken);

        if (isVideo)
        {
            await queue.EnqueueAsync(assetId, cancellationToken);
        }
        await audit.RecordAsync("MediaAsset", assetId.ToString(), "Upload", session.FileName, cancellationToken);
        return Results.Ok(asset.ToDto(storage.GetPublicUrl));
    }
}
