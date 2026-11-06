using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace StudioVnl.Imaging;

/// <summary>Format de sortie d'une déclinaison web.</summary>
public enum WebImageFormat
{
    /// <summary>WebP : le format servi aux navigateurs (lu partout depuis Safari 14).</summary>
    Webp,

    /// <summary>JPEG : image de partage (Open Graph, e-mails), lue par tous les réseaux sociaux.</summary>
    Jpeg,
}

/// <summary>Image refusée avant décodage : fichier illisible ou trop grand.</summary>
public class WebImageException(string message, Exception? inner = null) : Exception(message, inner);

/// <summary>
/// Photo prête à être déclinée pour le web : décodée une fois, redressée selon
/// l'orientation EXIF, puis débarrassée de ses métadonnées (EXIF, IPTC, XMP —
/// donc l'appareil, la date et surtout la position GPS). Le profil de couleur
/// ICC est conservé : sans lui, une photo exportée en Adobe RGB ou Display P3
/// virerait à l'affichage.
/// </summary>
public sealed class WebImage : IDisposable
{
    /// <summary>Largeurs servies par défaut (attribut `srcset`) : mobile, écran large, écran haute densité.</summary>
    public static readonly IReadOnlyList<int> DefaultWidths = [800, 1600, 2400];

    /// <summary>Qualité WebP : à l'œil identique à l'original, 5 à 10 fois plus léger qu'un JPEG d'export.</summary>
    public const int DefaultWebpQuality = 80;

    public const int DefaultJpegQuality = 82;

    /// <summary>120 mégapixels : au-delà d'un boîtier moyen format. Protège la mémoire du serveur.</summary>
    public const long DefaultMaxPixels = 120_000_000;

    private readonly Image _image;

    private WebImage(Image image)
    {
        _image = image;
    }

    /// <summary>Largeur après redressement (une photo portrait prise à l'horizontale est remise debout).</summary>
    public int Width => _image.Width;

    public int Height => _image.Height;

    /// <summary>
    /// Décode une photo (JPEG, PNG, WebP, GIF, TIFF, BMP). Les dimensions sont
    /// lues avant le décodage complet pour refuser les fichiers démesurés sans
    /// allouer leur mémoire.
    /// </summary>
    public static async Task<WebImage> LoadAsync(
        Stream source,
        CancellationToken cancellationToken,
        long maxPixels = DefaultMaxPixels)
    {
        var seekable = source;
        if (!source.CanSeek)
        {
            seekable = new MemoryStream();
            await source.CopyToAsync(seekable, cancellationToken);
            seekable.Position = 0;
        }

        try
        {
            var start = seekable.Position;
            ImageInfo info;
            try
            {
                info = await Image.IdentifyAsync(seekable, cancellationToken);
            }
            catch (Exception exception) when (exception is ImageFormatException or UnknownImageFormatException or NotSupportedException)
            {
                throw new WebImageException("Image illisible ou format non pris en charge.", exception);
            }
            if ((long)info.Width * info.Height > maxPixels)
            {
                throw new WebImageException(
                    $"Image trop grande : {info.Width}×{info.Height} px (maximum {maxPixels / 1_000_000} mégapixels).");
            }

            seekable.Position = start;
            Image image;
            try
            {
                // Une seule image : une animation GIF/WebP n'a pas sa place dans une galerie photo.
                image = await Image.LoadAsync(new DecoderOptions { MaxFrames = 1 }, seekable, cancellationToken);
            }
            catch (Exception exception) when (exception is ImageFormatException or UnknownImageFormatException or NotSupportedException)
            {
                throw new WebImageException("Image illisible ou format non pris en charge.", exception);
            }

            image.Mutate(context => context.AutoOrient());
            image.Metadata.ExifProfile = null;
            image.Metadata.IptcProfile = null;
            image.Metadata.XmpProfile = null;
            foreach (var frame in image.Frames)
            {
                frame.Metadata.ExifProfile = null;
                frame.Metadata.XmpProfile = null;
            }
            return new WebImage(image);
        }
        finally
        {
            if (!ReferenceEquals(seekable, source))
            {
                await seekable.DisposeAsync();
            }
        }
    }

    /// <summary>
    /// Largeurs à produire pour une source donnée : jamais d'agrandissement.
    /// Une photo plus étroite que la plus petite cible donne une seule
    /// déclinaison à sa largeur d'origine.
    /// </summary>
    public static IReadOnlyList<int> PlanWidths(int sourceWidth, IEnumerable<int> targets)
    {
        if (sourceWidth <= 0)
        {
            return [];
        }
        var widths = targets.Where(w => w > 0 && w <= sourceWidth).Distinct().Order().ToList();
        return widths.Count > 0 ? widths : [sourceWidth];
    }

    /// <summary>Hauteur correspondant à une largeur cible, proportions conservées.</summary>
    public static int ScaledHeight(int sourceWidth, int sourceHeight, int targetWidth) =>
        sourceWidth <= 0 ? sourceHeight : Math.Max(1, (int)Math.Round((double)sourceHeight * targetWidth / sourceWidth));

    /// <summary>
    /// Écrit une déclinaison de <paramref name="maxWidth"/> px de large au plus
    /// (jamais agrandie) et renvoie ses dimensions réelles.
    /// </summary>
    public async Task<(int Width, int Height)> SaveAsync(
        Stream destination,
        int maxWidth,
        WebImageFormat format,
        CancellationToken cancellationToken,
        int? quality = null)
    {
        var width = Math.Min(maxWidth, _image.Width);
        var height = ScaledHeight(_image.Width, _image.Height, width);

        IImageEncoder encoder = format switch
        {
            WebImageFormat.Webp => new WebpEncoder
            {
                Quality = quality ?? DefaultWebpQuality,
                FileFormat = WebpFileFormatType.Lossy,
                // Compression plus lente mais plus fine : le traitement se fait une fois, la page est vue mille fois.
                Method = WebpEncodingMethod.BestQuality,
            },
            _ => new JpegEncoder { Quality = quality ?? DefaultJpegQuality, Interleaved = true },
        };

        if (width == _image.Width)
        {
            await _image.SaveAsync(destination, encoder, cancellationToken);
            return (_image.Width, _image.Height);
        }

        using var resized = _image.Clone(context => context.Resize(new ResizeOptions
        {
            Size = new Size(width, height),
            Mode = ResizeMode.Stretch,
            Sampler = KnownResamplers.Lanczos3,
        }));
        await resized.SaveAsync(destination, encoder, cancellationToken);
        return (resized.Width, resized.Height);
    }

    /// <summary>Variante fichier de <see cref="SaveAsync(Stream, int, WebImageFormat, CancellationToken, int?)"/>.</summary>
    public async Task<(int Width, int Height)> SaveAsync(
        string path,
        int maxWidth,
        WebImageFormat format,
        CancellationToken cancellationToken,
        int? quality = null)
    {
        await using var file = File.Create(path);
        return await SaveAsync(file, maxWidth, format, cancellationToken, quality);
    }

    public void Dispose() => _image.Dispose();
}
