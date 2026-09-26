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
        Pack: "combo",
        Region: "brabant-wallon",
        Locale: "fr",
        EventDate: "2026-09-12",
        BudgetRange: "2 000 – 5 000 €",
        Message: "Cérémonie à Wavre.",
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

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("photo")]
    [InlineData("video")]
    [InlineData("combo")]
    [InlineData("custom")]
    public void Accepte_une_formule_connue_ou_absente(string? pack)
    {
        var result = _validator.Validate(Valid() with { Pack = pack });
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Rejette_une_formule_inconnue()
    {
        var result = _validator.Validate(Valid() with { Pack = "premium" });
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateLeadRequest.Pack));
    }

    [Theory]
    [InlineData("Brabant Wallon")]
    [InlineData("paris/idf")]
    public void Rejette_une_region_qui_n_est_pas_un_identifiant(string region)
    {
        var result = _validator.Validate(Valid() with { Region = region });
        Assert.False(result.IsValid);
        Assert.Contains(result.Errors, e => e.PropertyName == nameof(CreateLeadRequest.Region));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("fr")]
    [InlineData("nl")]
    [InlineData("en")]
    public void Accepte_les_trois_langues_du_site(string? locale)
    {
        var result = _validator.Validate(Valid() with { Locale = locale });
        Assert.True(result.IsValid);
    }

    [Fact]
    public void Rejette_une_langue_inconnue()
    {
        var result = _validator.Validate(Valid() with { Locale = "de" });
        Assert.False(result.IsValid);
    }
}
