using StudioVnl.Application.Dtos;
using StudioVnl.Application.Validation;
using Xunit;

namespace StudioVnl.Tests;

public class CreateLeadValidatorTests
{
    private readonly CreateLeadValidator _validator = new();

    private static CreateLeadRequest Valid() => new(
        Name: "Camille Martin",
        Email: "camille@example.fr",
        ProjectType: "Mariage",
        EventDate: "2026-09-12",
        BudgetRange: "2 000 – 5 000 €",
        Message: "Cérémonie à Lyon.",
        Website: "");

    [Fact]
    public void Accepte_une_demande_valide()
    {
        var result = _validator.Validate(Valid());
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Rejette_le_pot_de_miel_rempli()
    {
        var result = _validator.Validate(Valid() with { Website = "https://spam.example" });
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateLeadRequest.Website));
    }

    [Theory]
    [InlineData("")]
    [InlineData("pas-un-email")]
    public void Rejette_un_email_invalide(string email)
    {
        var result = _validator.Validate(Valid() with { Email = email });
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Rejette_un_nom_vide()
    {
        var result = _validator.Validate(Valid() with { Name = "" });
        Assert.False(result.IsValid);
    }

    [Theory]
    [InlineData("12/09/2026")]
    [InlineData("2026-13-40")]
    public void Rejette_une_date_mal_formee(string date)
    {
        var result = _validator.Validate(Valid() with { EventDate = date });
        Assert.False(result.IsValid);
    }

    [Fact]
    public void Accepte_une_date_absente()
    {
        var result = _validator.Validate(Valid() with { EventDate = null });
        Assert.True(result.IsValid);
    }
}
