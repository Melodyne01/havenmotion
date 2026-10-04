namespace StudioVnl.Domain.Entities;

/// <summary>
/// Un projet réel publié (mariage, événement, tournage d'entreprise…) : la
/// preuve que le studio travaille là où le site le dit. Une seule ligne
/// pour les trois langues (titre, résumé et récit par langue) : les médias
/// et les faits (lieu, ville, date) sont communs, seul le texte change —
/// et une page n'existe dans une langue que si son titre y est rempli.
/// </summary>
public class Project
{
    public Guid Id { get; set; }

    /// <summary>Slug unique, commun aux trois langues ; contient le lieu (`mariage-chateau-de-la-hulpe`).</summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>Clé neutre de la catégorie (slug FR : `mariage`, `corporate`…).</summary>
    public string CategoryKey { get; set; } = string.Empty;

    /// <summary>Identifiant de la région (slug FR de `regions.ts`), ou vide.</summary>
    public string RegionId { get; set; } = string.Empty;

    /// <summary>Lieu nommé (salle, château, entreprise), tel qu'on le cherche.</summary>
    public string Venue { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    /// <summary>Code pays ISO (`BE`, `FR`, `LU`, `NL`, `GR`…).</summary>
    public string CountryCode { get; set; } = "BE";

    public DateOnly? Date { get; set; }

    public string TitleFr { get; set; } = string.Empty;
    public string TitleNl { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string SummaryFr { get; set; } = string.Empty;
    public string SummaryNl { get; set; } = string.Empty;
    public string SummaryEn { get; set; } = string.Empty;

    /// <summary>Récit : paragraphes séparés par une ligne vide.</summary>
    public string BodyFr { get; set; } = string.Empty;
    public string BodyNl { get; set; } = string.Empty;
    public string BodyEn { get; set; } = string.Empty;

    /// <summary>Formule livrée (`photo`, `video`, `combo`, `custom`) ou vide.</summary>
    public string Pack { get; set; } = string.Empty;

    public Guid? CoverMediaId { get; set; }
    public MediaAsset? CoverMedia { get; set; }
    public Guid? VideoMediaId { get; set; }
    public MediaAsset? VideoMedia { get; set; }

    /// <summary>Identifiants des médias de la galerie, sérialisés en JSON (liste de GUID).</summary>
    public string GalleryJson { get; set; } = "[]";

    public bool IsFeatured { get; set; }
    public int SortOrder { get; set; }
    public PublishStatus Status { get; set; } = PublishStatus.Draft;
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Un avis client réel, dans la langue où il a été écrit. Remplace les
/// témoignages d'attente : rien n'est affiché tant qu'aucun avis publié
/// n'existe.
/// </summary>
public class Review
{
    public Guid Id { get; set; }
    public string Author { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    /// <summary>Clé neutre de la catégorie (slug FR), ou vide.</summary>
    public string CategoryKey { get; set; } = string.Empty;

    /// <summary>Note sur 5.</summary>
    public int Rating { get; set; } = 5;

    /// <summary>Langue de la citation (`fr`, `nl`, `en`).</summary>
    public string Locale { get; set; } = "fr";

    public string Quote { get; set; } = string.Empty;
    public DateOnly? Date { get; set; }

    /// <summary>D'où vient l'avis : `google`, `email`, `facebook`… (texte libre).</summary>
    public string Source { get; set; } = string.Empty;

    public Guid? ProjectId { get; set; }
    public Project? Project { get; set; }

    public bool IsPublished { get; set; } = true;
    public int SortOrder { get; set; }
}
