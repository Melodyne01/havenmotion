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
