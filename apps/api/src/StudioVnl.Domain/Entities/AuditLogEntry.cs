namespace StudioVnl.Domain.Entities;

/// <summary>Trace des modifications faites dans le backoffice : qui, quoi, quand.</summary>
public class AuditLogEntry
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public string Entity { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Diff { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
