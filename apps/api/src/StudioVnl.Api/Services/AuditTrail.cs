using System.Security.Claims;
using StudioVnl.Application.Abstractions;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Services;

/// <summary>Écrit une ligne de journal par mutation du backoffice.</summary>
public class AuditTrail(AppDbContext db, IHttpContextAccessor httpContextAccessor) : IAuditTrail
{
    public async Task RecordAsync(
        string entity,
        string entityId,
        string action,
        string diff,
        CancellationToken cancellationToken)
    {
        var user = httpContextAccessor.HttpContext?.User;
        db.AuditLog.Add(new AuditLogEntry
        {
            Id = Guid.NewGuid(),
            UserId = user?.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty,
            UserEmail = user?.FindFirstValue(ClaimTypes.Email) ?? "système",
            Entity = entity,
            EntityId = entityId,
            Action = action,
            Diff = diff.Length > 4000 ? diff[..4000] : diff,
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(cancellationToken);
    }
}
