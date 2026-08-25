namespace StudioVnl.Domain.Entities;

/// <summary>Historique des showreels activés, pour revenir à une version antérieure.</summary>
public class ShowreelHistoryEntry
{
    public Guid Id { get; set; }
    public Guid MediaId { get; set; }
    public MediaAsset? Media { get; set; }
    public DateTime ActivatedAt { get; set; }
}
