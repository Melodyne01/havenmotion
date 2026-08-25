using System.Threading.Channels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Infrastructure.Video;

/// <summary>File en mémoire alimentée par l'endpoint d'upload.</summary>
public class VideoProcessingQueue : IVideoProcessingQueue
{
    private readonly Channel<Guid> _channel = Channel.CreateUnbounded<Guid>();

    public ValueTask EnqueueAsync(Guid mediaAssetId, CancellationToken cancellationToken) =>
        _channel.Writer.WriteAsync(mediaAssetId, cancellationToken);

    public IAsyncEnumerable<Guid> ReadAllAsync(CancellationToken cancellationToken) =>
        _channel.Reader.ReadAllAsync(cancellationToken);
}

/// <summary>
/// Consommateur de la file : passe l'asset en `Processing`, lance FFmpeg puis
/// écrit `Ready` (rendus + poster) ou `Failed`. Le backoffice lit ce statut.
/// </summary>
public class VideoProcessingService(
    VideoProcessingQueue queue,
    IServiceScopeFactory scopeFactory,
    ILogger<VideoProcessingService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var assetId in queue.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessOneAsync(assetId, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                logger.LogError(exception, "Transcodage en échec pour {AssetId}", assetId);
                await MarkFailedAsync(assetId, stoppingToken);
            }
        }
    }

    private async Task ProcessOneAsync(Guid assetId, CancellationToken cancellationToken)
    {
        using var scope = scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var transcoder = scope.ServiceProvider.GetRequiredService<IVideoTranscoder>();

        var asset = await db.MediaAssets.FirstOrDefaultAsync(a => a.Id == assetId, cancellationToken);
        if (asset is null || asset.Kind != MediaKind.Video)
        {
            return;
        }

        asset.ProcessingStatus = ProcessingStatus.Processing;
        await db.SaveChangesAsync(cancellationToken);

        var result = await transcoder.ProcessAsync(asset, cancellationToken);

        asset.RenditionsJson = DtoMapper.ToRenditionsJson(
            result.Renditions.Select(r => new DtoMapper.StoredRendition(r.Type, r.Key, r.Width, r.Height, r.Muted)));
        asset.PosterPath = result.PosterKey;
        asset.Width = result.Width;
        asset.Height = result.Height;
        asset.DurationSec = result.DurationSec;
        asset.ProcessingStatus = ProcessingStatus.Ready;
        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Transcodage terminé pour {FileName}", asset.FileName);
    }

    private async Task MarkFailedAsync(Guid assetId, CancellationToken cancellationToken)
    {
        try
        {
            using var scope = scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.MediaAssets
                .Where(a => a.Id == assetId)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(a => a.ProcessingStatus, ProcessingStatus.Failed),
                    cancellationToken);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Impossible de marquer {AssetId} en échec", assetId);
        }
    }
}
