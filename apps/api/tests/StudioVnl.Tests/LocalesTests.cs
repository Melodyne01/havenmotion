using StudioVnl.Application;
using Xunit;

namespace StudioVnl.Tests;

public class LocalesTests
{
    [Theory]
    [InlineData("fr", "fr")]
    [InlineData("nl", "nl")]
    [InlineData("en", "en")]
    [InlineData("de", "fr")]
    [InlineData("", "fr")]
    [InlineData(null, "fr")]
    public void Toute_langue_inconnue_retombe_sur_le_francais(string? input, string expected)
    {
        Assert.Equal(expected, Locales.Normalize(input));
    }
}
