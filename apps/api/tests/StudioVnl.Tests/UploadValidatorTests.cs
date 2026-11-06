using StudioVnl.Application.Dtos;
using StudioVnl.Application.Validation;
using Xunit;

namespace StudioVnl.Tests;

public class UploadValidatorTests
{
    private readonly StartUploadValidator _validator = new();

    private static StartUploadRequest Valid() =>
        new("SHOWREEL_2026.MP4", "video/mp4", 512L * 1024 * 1024, 103);

    [Fact]
    public void Accepte_une_video_mp4()
    {
        Assert.True(_validator.Validate(Valid()).IsValid);
    }

    [Theory]
    [InlineData("application/x-msdownload")]
    [InlineData("text/html")]
    [InlineData("")]
    public void Rejette_les_types_non_medias(string contentType)
    {
        var result = _validator.Validate(Valid() with { ContentType = contentType });
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Rejette_un_fichier_au_dela_de_4_Go()
    {
        var result = _validator.Validate(Valid() with { SizeBytes = StartUploadValidator.MaxSizeBytes + 1 });
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Rejette_zero_morceau()
    {
        Assert.False(_validator.Validate(Valid() with { TotalChunks = 0 }).IsValid);
    }
}

public class ImageUploadValidatorTests
{
    private readonly StartUploadValidator _validator = new();

    [Fact]
    public void Accepte_une_photo_de_40_Mo()
    {
        Assert.True(_validator.Validate(new StartUploadRequest("mariage.jpg", "image/jpeg", 40L * 1024 * 1024, 8)).IsValid);
    }

    [Fact]
    public void Rejette_une_photo_au_dela_de_100_Mo()
    {
        var request = new StartUploadRequest("mariage.tif", "image/png", StartUploadValidator.MaxImageSizeBytes + 1, 21);
        Assert.False(_validator.Validate(request).IsValid);
    }
}

public class UpdateMediaAltValidatorTests
{
    private readonly UpdateMediaAltValidator _validator = new();

    [Fact]
    public void Accepte_des_textes_vides()
    {
        Assert.True(_validator.Validate(new UpdateMediaAltRequest("", "", "")).IsValid);
    }

    [Fact]
    public void Rejette_un_texte_trop_long()
    {
        var tooLong = new string('a', UpdateMediaAltValidator.MaxLength + 1);
        Assert.False(_validator.Validate(new UpdateMediaAltRequest("Les mariés", tooLong, "")).IsValid);
    }
}
