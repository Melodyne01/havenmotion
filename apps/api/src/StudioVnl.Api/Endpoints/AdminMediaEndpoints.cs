using Microsoft.EntityFrameworkCore;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Application.Validation;
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
        media.MapPost("/{id:guid}/reprocess", ReprocessAsync);
        media.MapPost("/reprocess-missing-teasers", ReprocessMissingTeasersAsync);
        media.MapPost("/reprocess-unoptimized-images", ReprocessUnoptimizedImagesAsync);
        media.MapPut("/{id:guid}/alt", UpdateAltAsync)
            .AddEndpointFilter<ValidationFilter<UpdateMediaAltRequest>>();

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

    /// <summary>Texte alternatif d'un média, dans les trois langues du site.</summary>
    private static async Task<IResult> UpdateAltAsync(
        Guid id,
        UpdateMediaAltRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var asset = await db.MediaAssets.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (asset is null)
        {
            return Results.NotFound();
        }

        asset.AltFr = request.Fr.Trim();
        asset.AltNl = request.Nl.Trim();
        asset.AltEn = request.En.Trim();
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync("MediaAsset", id.ToString(), "UpdateAlt", asset.FileName, cancellationToken);
        return Results.Ok(asset.ToDto(storage.GetPublicUrl));
    }

    /// <summary>
    /// Relance le traitement depuis l'original conservé. Vidéo : remise en file
    /// de transcodage (par exemple pour créer l'extrait muet des vidéos traitées
    /// avant son ajout), les anciens rendus restent servis jusqu'à ce que les
    /// nouveaux les remplacent. Photo : optimisée tout de suite (quelques secondes).
    /// </summary>
    private static async Task<IResult> ReprocessAsync(
        Guid id,
        AppDbContext db,
        IMediaStorage storage,
        IVideoProcessingQueue queue,
        IImageProcessor images,
        IAuditTrail audit,
        ILoggerFactory loggers,
        CancellationToken cancellationToken)
    {
        var asset = await db.MediaAssets.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (asset is null)
        {
            return Results.NotFound();
        }
        if (!IsReprocessable(asset))
        {
            return Results.Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: asset.Kind == MediaKind.Image
                    ? "Cette image est servie telle quelle (AVIF ou fichier du site) : rien à retraiter."
                    : "Seule une vidéo déposée dans la bibliothèque peut être retraitée.");
        }
        if (asset.ProcessingStatus is ProcessingStatus.Pending or ProcessingStatus.Processing)
        {
            return Results.Problem(
                statusCode: StatusCodes.Status409Conflict,
                title: "Ce média est déjà en file de traitement.");
        }

        if (asset.Kind == MediaKind.Image)
        {
            var problem = await OptimizeImageAsync(asset, images, loggers, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
            await audit.RecordAsync("MediaAsset", id.ToString(), "Reprocess", asset.FileName, cancellationToken);
            return problem is null
                ? Results.Ok(asset.ToDto(storage.GetPublicUrl))
                : Results.Problem(statusCode: StatusCodes.Status422UnprocessableEntity, title: problem.Message);
        }

        asset.ProcessingStatus = ProcessingStatus.Pending;
        await db.SaveChangesAsync(cancellationToken);
        await queue.EnqueueAsync(asset.Id, cancellationToken);
        await audit.RecordAsync("MediaAsset", id.ToString(), "Reprocess", asset.FileName, cancellationToken);
        return Results.Ok(asset.ToDto(storage.GetPublicUrl));
    }

    /// <summary>Met en file toutes les vidéos prêtes qui n'ont pas encore d'extrait muet.</summary>
    private static async Task<IResult> ReprocessMissingTeasersAsync(
        AppDbContext db,
        IVideoProcessingQueue queue,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var candidates = await db.MediaAssets
            .Where(a => a.Kind == MediaKind.Video && a.ProcessingStatus == ProcessingStatus.Ready)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
        var missing = candidates
            .Where(a => IsReprocessable(a) && !DtoMapper.ParseRenditions(a.RenditionsJson, key => key).Any(r => r.Teaser))
            .ToList();

        foreach (var asset in missing)
        {
            asset.ProcessingStatus = ProcessingStatus.Pending;
        }
        await db.SaveChangesAsync(cancellationToken);
        foreach (var asset in missing)
        {
            await queue.EnqueueAsync(asset.Id, cancellationToken);
        }
        await audit.RecordAsync("MediaAsset", "*", "Reprocess", $"{missing.Count} vidéo(s) sans extrait", cancellationToken);
        return Results.Ok(new ReprocessResponse(missing.Count));
    }

    /// <summary>
    /// Met en file toutes les photos optimisables qui n'ont encore aucune
    /// déclinaison web (déposées avant l'optimisation automatique, ou en échec).
    /// Elles restent servies telles quelles en attendant.
    /// </summary>
    private static async Task<IResult> ReprocessUnoptimizedImagesAsync(
        AppDbContext db,
        IVideoProcessingQueue queue,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var candidates = await db.MediaAssets
            .Where(a => a.Kind == MediaKind.Image
                && (a.ProcessingStatus == ProcessingStatus.Ready || a.ProcessingStatus == ProcessingStatus.Failed))
            .OrderBy(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
        var unoptimized = candidates.Where(MediaProcessing.IsUnoptimizedImage).ToList();

        foreach (var asset in unoptimized)
        {
            asset.ProcessingStatus = ProcessingStatus.Pending;
        }
        await db.SaveChangesAsync(cancellationToken);
        foreach (var asset in unoptimized)
        {
            await queue.EnqueueAsync(asset.Id, cancellationToken);
        }
        await audit.RecordAsync("MediaAsset", "*", "Reprocess", $"{unoptimized.Count} image(s) non optimisée(s)", cancellationToken);
        return Results.Ok(new ReprocessResponse(unoptimized.Count));
    }

    /// <param name="Rejected">Le fichier n'est pas une image exploitable (illisible, démesuré) : inutile de le garder.</param>
    private sealed record ImageFailure(string Message, bool Rejected);

    /// <summary>
    /// Optimise une photo et met l'asset à jour (sans l'enregistrer). En cas
    /// d'échec, renvoie le message à afficher ; l'asset passe alors en `Failed`
    /// et l'original reste servi.
    /// </summary>
    private static async Task<ImageFailure?> OptimizeImageAsync(
        MediaAsset asset,
        IImageProcessor images,
        ILoggerFactory loggers,
        CancellationToken cancellationToken)
    {
        try
        {
            asset.Apply(await images.ProcessAsync(asset, cancellationToken));
            return null;
        }
        catch (InvalidMediaException exception)
        {
            asset.ProcessingStatus = ProcessingStatus.Failed;
            return new ImageFailure(exception.Message, Rejected: true);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            loggers.CreateLogger(typeof(AdminMediaEndpoints)).LogError(exception, "Optimisation en échec pour {FileName}", asset.FileName);
            asset.ProcessingStatus = ProcessingStatus.Failed;
            return new ImageFailure("L'optimisation de l'image a échoué. Réessayez avec « Retraiter ».", Rejected: false);
        }
    }

    /// <summary>
    /// Média dont l'original est dans le stockage. Les plans d'ambiance provisoires
    /// pointent vers des fichiers du front (`/ambience/…`) : rien à transcoder.
    /// Une image AVIF est servie telle quelle.
    /// </summary>
    private static bool IsReprocessable(MediaAsset asset) =>
        asset.Kind == MediaKind.Video
            ? MediaProcessing.HasStoredOriginal(asset)
            : MediaProcessing.IsOptimizableImage(asset);

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
        IImageProcessor images,
        IAuditTrail audit,
        ILoggerFactory loggers,
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
        // L'extension du fichier stocké vient du `ContentType` validé à l'ouverture
        // de la session (allowlist dans StartUploadValidator), jamais du nom de
        // fichier fourni par le client : `/media` sert les fichiers statiquement en
        // déduisant leur Content-Type HTTP de l'extension, donc un nom de fichier
        // trompeur (ex. `.html`) associé à un contenu arbitraire pourrait sinon être
        // servi comme tel — XSS stocké potentiel derrière un compte admin compromis.
        var extension = ExtensionFor(session.ContentType);
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
            // Une vidéo part au transcodage ; une photo est optimisée ci-dessous.
            ProcessingStatus = isVideo ? ProcessingStatus.Pending : ProcessingStatus.Ready,
            PosterPath = isVideo ? null : originalKey,
            CreatedAt = DateTime.UtcNow,
        };

        // Photo : déclinaisons WebP + image de partage, tout de suite (quelques
        // secondes) — l'admin repart avec une image prête. Un fichier qui n'est
        // pas une image lisible est refusé et effacé.
        if (MediaProcessing.IsOptimizableImage(asset))
        {
            var problem = await OptimizeImageAsync(asset, images, loggers, cancellationToken);
            if (problem is { Rejected: true })
            {
                await storage.DeleteAsync(originalKey, cancellationToken);
                db.UploadSessions.Remove(session);
                await db.SaveChangesAsync(cancellationToken);
                return Results.Problem(statusCode: StatusCodes.Status422UnprocessableEntity, title: problem.Message);
            }
        }

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

    /// <summary>
    /// Extension canonique pour un type de contenu de l'allowlist
    /// (<see cref="StartUploadValidator.AllowedContentTypes"/>). `contentType` est
    /// déjà validé à ce stade ; une valeur hors liste ne devrait jamais arriver.
    /// </summary>
    private static string ExtensionFor(string contentType) => contentType switch
    {
        "video/mp4" => ".mp4",
        "video/quicktime" => ".mov",
        "video/x-matroska" => ".mkv",
        "image/jpeg" => ".jpg",
        "image/png" => ".png",
        "image/webp" => ".webp",
        "image/avif" => ".avif",
        _ => throw new InvalidOperationException($"Type de contenu non pris en charge : {contentType}."),
    };
}
