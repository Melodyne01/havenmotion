using StudioVnl.Application.Abstractions;
using Xunit;

namespace StudioVnl.Tests;

public class MediaKeysTests
{
    [Theory]
    [InlineData("https://assets.mixkit.co/videos/preview/extrait.mp4")]
    [InlineData("http://cdn.test/extrait.mp4")]
    [InlineData("/placeholders/mariage-reel.svg")]
    public void Une_url_publique_est_reconnue(string key)
    {
        Assert.True(MediaKeys.IsAlreadyPublic(key));
    }

    [Theory]
    [InlineData("originals/9f2c.mp4")]
    [InlineData("renditions/9f2c/band-muted.mp4")]
    [InlineData("uploads/9f2c/00001.part")]
    public void Une_cle_de_stockage_reste_a_resoudre(string key)
    {
        Assert.False(MediaKeys.IsAlreadyPublic(key));
    }
}
