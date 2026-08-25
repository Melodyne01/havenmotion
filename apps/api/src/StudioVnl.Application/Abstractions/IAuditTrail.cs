namespace StudioVnl.Application.Abstractions;

/// <summary>Journalisation des modifications du backoffice.</summary>
public interface IAuditTrail
{
    Task RecordAsync(string entity, string entityId, string action, string diff, CancellationToken cancellationToken);
}
