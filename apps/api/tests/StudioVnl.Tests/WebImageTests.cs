using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Metadata.Profiles.Exif;
using SixLabors.ImageSharp.PixelFormats;
using StudioVnl.Application.Abstractions;
using StudioVnl.Domain.Entities;
using StudioVnl.Imaging;
using Xunit;

namespace StudioVnl.Tests;

public class WebImageTests
{
    [Fact]
    public void Ne_prevoit_jamais_d_agrandissement()
    {
        Assert.Equal([800, 1600], WebImage.PlanWidths(2000, WebImage.DefaultWidths));
        Assert.Equal([800, 1600, 2400], WebImage.PlanWidths(6000, WebImage.DefaultWidths));
    }

    [Fact]
    public void Une_photo_etroite_garde_sa_largeur()
    {
        Assert.Equal([640], WebImage.PlanWidths(640, WebImage.DefaultWidths));
    }

    [Fact]
    public void Conserve_les_proportions()
    {
        Assert.Equal(1067, WebImage.ScaledHeight(6000, 4000, 1600));
        Assert.Equal(2400, WebImage.ScaledHeight(4000, 6000, 1600));
    }

    /// <summary>JPEG 400×300 pris « couché » (orientation EXIF 6) avec une position GPS.</summary>
    private static MemoryStream CameraJpeg()
    {
        using var image = new Image<Rgb24>(400, 300, new Rgb24(200, 120, 40));
        var exif = new ExifProfile();
        exif.SetValue(ExifTag.Orientation, (ushort)6);
        exif.SetValue(ExifTag.Make, "Canon");
        exif.SetValue(ExifTag.GPSLatitudeRef, "N");
        exif.SetValue(ExifTag.GPSLatitude, [new Rational(50), new Rational(50), new Rational(0)]);
        image.Metadata.ExifProfile = exif;
        var stream = new MemoryStream();
        image.SaveAsJpeg(stream, new JpegEncoder { Quality = 95 });
        stream.Position = 0;
        return stream;
    }

    [Fact]
    public async Task Redresse_la_photo_et_retire_exif_et_gps()
    {
        using var source = CameraJpeg();
        using var web = await WebImage.LoadAsync(source, CancellationToken.None);

        // Orientation 6 : la photo est remise debout (portrait).
        Assert.Equal(300, web.Width);
        Assert.Equal(400, web.Height);

        using var output = new MemoryStream();
        var (width, height) = await web.SaveAsync(output, 1600, WebImageFormat.Webp, CancellationToken.None);
        Assert.Equal((300, 400), (width, height));

        output.Position = 0;
        var info = await Image.IdentifyAsync(output);
        Assert.Equal("WEBP", info.Metadata.DecodedImageFormat?.Name.ToUpperInvariant());
        Assert.Null(info.Metadata.ExifProfile);
        Assert.Null(info.Metadata.XmpProfile);
    }

    [Fact]
    public async Task Reduit_a_la_largeur_demandee()
    {
        using var source = new MemoryStream();
        using (var image = new Image<Rgb24>(3200, 2000))
        {
            await image.SaveAsPngAsync(source);
        }
        source.Position = 0;

        using var web = await WebImage.LoadAsync(source, CancellationToken.None);
        using var output = new MemoryStream();
        Assert.Equal((800, 500), await web.SaveAsync(output, 800, WebImageFormat.Jpeg, CancellationToken.None));
    }

    [Fact]
    public async Task Refuse_un_fichier_qui_n_est_pas_une_image()
    {
        using var source = new MemoryStream("<html>pas une photo</html>"u8.ToArray());
        await Assert.ThrowsAsync<WebImageException>(() => WebImage.LoadAsync(source, CancellationToken.None));
    }

    [Fact]
    public async Task Refuse_une_image_demesuree_avant_de_la_decoder()
    {
        using var source = CameraJpeg();
        await Assert.ThrowsAsync<WebImageException>(() => WebImage.LoadAsync(source, CancellationToken.None, maxPixels: 1000));
    }
}

public class MediaProcessingTests
{
    private static MediaAsset Image(string path, string renditions = "[]") => new()
    {
        Kind = MediaKind.Image,
        OriginalPath = path,
        RenditionsJson = renditions,
    };

    [Fact]
    public void Une_photo_deposee_sans_declinaison_est_a_optimiser()
    {
        Assert.True(MediaProcessing.IsUnoptimizedImage(Image("originals/abc.jpg")));
    }

    [Fact]
    public void Une_photo_deja_declinee_ne_l_est_plus()
    {
        var asset = Image("originals/abc.jpg", """[{"type":"image/webp","key":"renditions/abc/800.webp","width":800,"height":533,"muted":false}]""");
        Assert.False(MediaProcessing.IsUnoptimizedImage(asset));
    }

    [Theory]
    [InlineData("originals/abc.avif")]
    [InlineData("/ambience/mariage.jpg")]
    public void L_avif_et_les_fichiers_du_site_sont_servis_tels_quels(string path)
    {
        Assert.False(MediaProcessing.IsOptimizableImage(Image(path)));
    }

    [Fact]
    public void Le_resultat_rend_l_image_prete_avec_son_image_de_partage()
    {
        var asset = Image("originals/abc.jpg");
        asset.ProcessingStatus = ProcessingStatus.Failed;
        asset.Apply(new ProcessedImage(
            [new ProcessedRendition("image/webp", "renditions/abc/800.webp", 800, 533, false)],
            "renditions/abc/share.jpg",
            4000,
            2667));

        Assert.Equal(ProcessingStatus.Ready, asset.ProcessingStatus);
        Assert.Equal("renditions/abc/share.jpg", asset.PosterPath);
        Assert.Equal((4000, 2667), (asset.Width, asset.Height));
        Assert.False(MediaProcessing.IsUnoptimizedImage(asset));
    }
}
