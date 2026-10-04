using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using Xunit;

namespace StudioVnl.Tests;

public class ProjectMapperTests
{
    [Fact]
    public void Une_langue_sans_titre_n_a_pas_de_texte()
    {
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Slug = "mariage-test",
            TitleFr = "Mariage test",
            SummaryFr = "Résumé",
            BodyFr = "Un.\n\nDeux.",
            GalleryJson = "[]",
        };

        var dto = project.ToDto(key => key, new Dictionary<Guid, MediaAsset>());

        Assert.NotNull(dto.Fr);
        Assert.Equal(["Un.", "Deux."], dto.Fr!.Paragraphs);
        Assert.Null(dto.Nl);
        Assert.Null(dto.En);
    }

    [Fact]
    public void La_galerie_ignore_les_medias_introuvables_et_garde_l_ordre()
    {
        var kept = new MediaAsset { Id = Guid.NewGuid(), FileName = "b.jpg", RenditionsJson = "[]" };
        var missing = Guid.NewGuid();
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Slug = "p",
            TitleEn = "P",
            GalleryJson = $"[\"{missing}\",\"{kept.Id}\"]",
        };

        var dto = project.ToDto(key => key, new Dictionary<Guid, MediaAsset> { [kept.Id] = kept });

        Assert.Single(dto.Gallery);
        Assert.Equal("b.jpg", dto.Gallery[0].FileName);
    }
}
