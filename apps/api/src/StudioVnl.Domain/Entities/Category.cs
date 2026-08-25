namespace StudioVnl.Domain.Entities;

/// <summary>Une bande du site public. Les cinq bandes sont la navigation.</summary>
public class Category
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    /// <summary>Compteur affiché s'il est renseigné ; sinon le nombre de films publiés.</summary>
    public int? FilmCountOverride { get; set; }

    public Guid? ReelMediaId { get; set; }
    public MediaAsset? ReelMedia { get; set; }
    public Guid? PosterMediaId { get; set; }
    public MediaAsset? PosterMedia { get; set; }
    public bool IsPublished { get; set; } = true;

    /// <summary>Les cinq catégories de base ne sont pas supprimables.</summary>
    public bool IsProtected { get; set; }

    public List<Film> Films { get; set; } = [];
}
