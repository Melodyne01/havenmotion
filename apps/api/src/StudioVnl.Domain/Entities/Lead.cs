namespace StudioVnl.Domain.Entities;

/// <summary>Demande de devis envoyée depuis le site public.</summary>
public class Lead
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ProjectType { get; set; } = string.Empty;

    /// <summary>Formule choisie : `photo`, `video`, `combo`, `custom`, ou vide si indécis.</summary>
    public string Pack { get; set; } = string.Empty;

    /// <summary>Région du tournage (slug FR de `regions.ts` côté front), ou vide.</summary>
    public string Region { get; set; } = string.Empty;

    /// <summary>Langue du formulaire d'origine (`fr`, `nl`, `en`).</summary>
    public string Locale { get; set; } = "fr";

    public DateOnly? EventDate { get; set; }
    public string BudgetRange { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public LeadStatus Status { get; set; } = LeadStatus.New;
    public DateTime CreatedAt { get; set; }
    public string UserAgent { get; set; } = string.Empty;
}
