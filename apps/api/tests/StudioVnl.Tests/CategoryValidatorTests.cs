using StudioVnl.Application.Dtos;
using StudioVnl.Application.Validation;
using Xunit;

namespace StudioVnl.Tests;

public class CategoryValidatorTests
{
    private readonly UpdateCategoryValidator _validator = new();

    private static UpdateCategoryRequest Valid() =>
        new("Mariage", "mariage", "Le film de votre journée.", null, true, null, null);

    [Fact]
    public void Accepte_une_categorie_valide()
    {
        Assert.True(_validator.Validate(Valid()).IsValid);
    }

    [Theory]
    [InlineData("Mariage")]
    [InlineData("mariage!")]
    [InlineData("-mariage")]
    [InlineData("")]
    public void Rejette_un_slug_invalide(string slug)
    {
        Assert.False(_validator.Validate(Valid() with { Slug = slug }).IsValid);
    }

    [Fact]
    public void Rejette_un_compteur_negatif()
    {
        Assert.False(_validator.Validate(Valid() with { FilmCount = -1 }).IsValid);
    }
}
