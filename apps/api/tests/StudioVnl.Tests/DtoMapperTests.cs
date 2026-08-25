using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using Xunit;

namespace StudioVnl.Tests;

public class DtoMapperTests
{
    [Fact]
    public void Serialise_et_relit_une_liste_de_chaines()
    {
        var json = DtoMapper.ToJson(["Repérage", "Étalonnage"]);
        var parsed = DtoMapper.ParseStringList(json);
        Assert.Equal(new[] { "Repérage", "Étalonnage" }, parsed);
    }

    [Theory]
    [InlineData("")]
    [InlineData("pas du json")]
    [InlineData("{\"objet\":1}")]
    public void Un_json_invalide_donne_une_liste_vide(string json)
    {
        Assert.Empty(DtoMapper.ParseStringList(json));
    }

    [Fact]
    public void Les_rendus_resolvent_leur_url_via_le_stockage()
    {
        var json = DtoMapper.ToRenditionsJson(
        [
            new DtoMapper.StoredRendition("video/mp4", "renditions/x/web.mp4", 1920, 1080, false),
            new DtoMapper.StoredRendition("video/mp4", "renditions/x/band-muted.mp4", 1280, 720, true),
        ]);
        var renditions = DtoMapper.ParseRenditions(json, key => $"https://cdn.test/{key}");

        Assert.Equal(2, renditions.Count);
        Assert.Equal("https://cdn.test/renditions/x/web.mp4", renditions[0].Url);
        Assert.True(renditions[1].Muted);
    }

    [Fact]
    public void Le_compteur_de_films_prefere_la_valeur_forcee()
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Slug = "mariage",
            Name = "Mariage",
            FilmCountOverride = 12,
        };
        var dto = category.ToDto(key => key, publishedFilmCount: 3);
        Assert.Equal(12, dto.FilmCount);

        category.FilmCountOverride = null;
        dto = category.ToDto(key => key, publishedFilmCount: 3);
        Assert.Equal(3, dto.FilmCount);
    }

    [Fact]
    public void Un_media_expose_son_poster_resolu()
    {
        var asset = new MediaAsset
        {
            Id = Guid.NewGuid(),
            Kind = MediaKind.Video,
            FileName = "MARIAGE_REEL.MP4",
            PosterPath = "renditions/y/poster.jpg",
            ProcessingStatus = ProcessingStatus.Ready,
        };
        var dto = asset.ToDto(key => $"/media/{key}");
        Assert.Equal("/media/renditions/y/poster.jpg", dto.PosterUrl);
        Assert.Equal("Ready", dto.ProcessingStatus);
    }
}
