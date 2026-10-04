using StudioVnl.Application.Dtos;
using StudioVnl.Application.Validation;
using Xunit;

namespace StudioVnl.Tests;

public class SaveProjectValidatorTests
{
    private readonly SaveProjectValidator _validator = new();

    private static SaveProjectRequest Valid() => new(
        Slug: "mariage-chateau-de-la-hulpe",
        CategoryKey: "mariage",
        RegionId: "brabant-wallon",
        Venue: "Château de La Hulpe",
        City: "La Hulpe",
        CountryCode: "BE",
        Date: "2026-06-20",
        Pack: "combo",
        Fr: new ProjectTextRequest("Mariage au château de La Hulpe", "Une journée complète.", "Premier paragraphe.\n\nSecond paragraphe."),
        Nl: new ProjectTextRequest("", "", ""),
        En: new ProjectTextRequest("", "", ""),
        Cover: null,
        Video: null,
        Gallery: [],
        IsFeatured: true,
        Status: "Published");

    [Fact]
    public void Accepte_un_projet_avec_une_seule_langue_remplie()
    {
        Assert.True(_validator.Validate(Valid()).IsValid);
    }

    [Fact]
    public void Rejette_un_projet_sans_titre_dans_aucune_langue()
    {
        var result = _validator.Validate(Valid() with { Fr = new ProjectTextRequest("", "", "") });
        Assert.False(result.IsValid);
    }

    [Theory]
    [InlineData("Château De La Hulpe")]
    [InlineData("mariage/la-hulpe")]
    public void Rejette_un_slug_qui_n_est_pas_une_url(string slug)
    {
        Assert.False(_validator.Validate(Valid() with { Slug = slug }).IsValid);
    }

    [Fact]
    public void Rejette_une_categorie_inconnue()
    {
        Assert.False(_validator.Validate(Valid() with { CategoryKey = "drone" }).IsValid);
    }

    [Fact]
    public void Rejette_une_formule_inconnue()
    {
        Assert.False(_validator.Validate(Valid() with { Pack = "premium" }).IsValid);
    }
}
