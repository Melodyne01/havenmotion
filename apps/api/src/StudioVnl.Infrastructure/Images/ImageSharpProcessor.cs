using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StudioVnl.Application.Abstractions;
using StudioVnl.Domain.Entities;
using StudioVnl.Imaging;

namespace StudioVnl.Infrastructure.Images;

public class ImageOptions
{
    public const string Section = "Images";

    /// <summary>Largeurs des déclinaisons WebP (attribut `srcset`).</summary>
    public int[] Widths { get; set; } = [.. WebImage.DefaultWidths];

    public int WebpQuality { get; set; } = WebImage.DefaultWebpQuality;

    /// <summary>Largeur de l'image de partage JPEG (Open Graph : 1200 px minimum recommandé).</summary>
    public int ShareWidth { get; set; } = 1600;

    public int JpegQuality { get; set; } = WebImage.DefaultJpegQuality;

    public long MaxPixels { get; set; } = WebImage.DefaultMaxPixels;
}

/// <summary>
/// Optimisation d'une photo déposée : WebP en 800, 1600 et 2400 px de large
/// (sans jamais agrandir), plus un JPEG 1600 px pour le partage sur les
/// réseaux sociaux. Redressée, sans EXIF ni GPS. L'original reste stocké pour
/// un retraitement ultérieur, mais n'est plus servi aux visiteurs.
/// </summary>
public class ImageSharpProcessor(
    IMediaStorage storage,
    IOptions<ImageOptions> options,
    ILogger<ImageSharpProcessor> logger) : IImageProcessor
{
    private readonly ImageOptions _options = options.Value;

    public async Task<ProcessedImage> ProcessAsync(MediaAsset asset, CancellationToken cancellationToken)
    {
        WebImage image;
        await using (var source = await storage.OpenReadAsync(asset.OriginalPath, cancellationToken))
        {
            try
            {
                image = await WebImage.LoadAsync(source, cancellationToken, _options.MaxPixels);
            }
            catch (WebImageException exception)
            {
                throw new InvalidMediaException(exception.Message, exception);
            }
        }

        using (image)
        {
            var prefix = $"renditions/{asset.Id:N}";
            var renditions = new List<ProcessedRendition>();
            foreach (var width in WebImage.PlanWidths(image.Width, _options.Widths))
            {
                var (w, h) = await SaveAsync(image, $"{prefix}/{width}.webp", width, WebImageFormat.Webp, _options.WebpQuality, cancellationToken);
                renditions.Add(new ProcessedRendition("image/webp", $"{prefix}/{width}.webp", w, h, Muted: false));
            }

            var shareKey = $"{prefix}/share.jpg";
            await SaveAsync(image, shareKey, _options.ShareWidth, WebImageFormat.Jpeg, _options.JpegQuality, cancellationToken);

            logger.LogInformation(
                "Image {FileName} optimisée : {Count} déclinaison(s) WebP, {Width}×{Height}",
                asset.FileName, renditions.Count, image.Width, image.Height);
            return new ProcessedImage(renditions, shareKey, image.Width, image.Height);
        }
    }

    private async Task<(int Width, int Height)> SaveAsync(
        WebImage image,
        string key,
        int maxWidth,
        WebImageFormat format,
        int quality,
        CancellationToken cancellationToken)
    {
        using var buffer = new MemoryStream();
        var size = await image.SaveAsync(buffer, maxWidth, format, cancellationToken, quality);
        buffer.Position = 0;
        await storage.SaveAsync(key, buffer, cancellationToken);
        return size;
    }
}
