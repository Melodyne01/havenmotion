using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Endpoints;

/// <summary>Demandes de devis : liste filtrée, statut, export CSV, journal.</summary>
public static class AdminLeadEndpoints
{
    public static void MapAdminLeadEndpoints(this RouteGroupBuilder admin)
    {
        var leads = admin.MapGroup("/leads").WithTags("Admin · Devis");
        leads.MapGet("/", ListAsync);
        leads.MapGet("/export.csv", ExportCsvAsync);
        leads.MapPatch("/{id:guid}", UpdateStatusAsync)
            .AddEndpointFilter<ValidationFilter<UpdateLeadStatusRequest>>();

        admin.MapGet("/audit", AuditAsync).WithTags("Admin · Journal");
    }

    private static async Task<IReadOnlyList<LeadDto>> ListAsync(
        string? projectType,
        string? budgetRange,
        string? status,
        string? from,
        string? to,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var query = BuildQuery(db, projectType, budgetRange, status, from, to);
        var leads = await query.OrderByDescending(l => l.CreatedAt).ToListAsync(cancellationToken);
        return leads.Select(l => l.ToDto()).ToList();
    }

    private static async Task<IResult> UpdateStatusAsync(
        Guid id,
        UpdateLeadStatusRequest request,
        AppDbContext db,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
        if (lead is null)
        {
            return Results.NotFound();
        }
        lead.Status = Enum.Parse<LeadStatus>(request.Status);
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync("Lead", id.ToString(), "SetStatus", request.Status, cancellationToken);
        return Results.Ok(lead.ToDto());
    }

    private static async Task<IResult> ExportCsvAsync(
        string? projectType,
        string? budgetRange,
        string? status,
        string? from,
        string? to,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var query = BuildQuery(db, projectType, budgetRange, status, from, to);
        var leads = await query.OrderByDescending(l => l.CreatedAt).ToListAsync(cancellationToken);

        var builder = new StringBuilder();
        builder.AppendLine("recue_le;nom;email;projet;date_evenement;budget;statut;message");
        foreach (var lead in leads)
        {
            builder.AppendLine(string.Join(';',
                lead.CreatedAt.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture),
                Csv(lead.Name),
                Csv(lead.Email),
                Csv(lead.ProjectType),
                lead.EventDate?.ToString("yyyy-MM-dd") ?? string.Empty,
                Csv(lead.BudgetRange),
                lead.Status.ToString(),
                Csv(lead.Message)));
        }

        // BOM UTF-8 pour l'ouverture directe dans Excel.
        var bytes = Encoding.UTF8.GetPreamble()
            .Concat(Encoding.UTF8.GetBytes(builder.ToString()))
            .ToArray();
        return Results.File(bytes, "text/csv", "demandes-de-devis.csv");
    }

    private static async Task<IReadOnlyList<AuditLogDto>> AuditAsync(
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var entries = await db.AuditLog.AsNoTracking()
            .OrderByDescending(a => a.CreatedAt)
            .Take(500)
            .ToListAsync(cancellationToken);
        return entries.Select(a => a.ToDto()).ToList();
    }

    private static IQueryable<Lead> BuildQuery(
        AppDbContext db,
        string? projectType,
        string? budgetRange,
        string? status,
        string? from,
        string? to)
    {
        var query = db.Leads.AsNoTracking();
        if (!string.IsNullOrEmpty(projectType))
        {
            query = query.Where(l => l.ProjectType.Contains(projectType));
        }
        if (!string.IsNullOrEmpty(budgetRange))
        {
            query = query.Where(l => l.BudgetRange.Contains(budgetRange));
        }
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<LeadStatus>(status, out var parsedStatus))
        {
            query = query.Where(l => l.Status == parsedStatus);
        }
        if (DateTime.TryParseExact(from, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var fromDate))
        {
            query = query.Where(l => l.CreatedAt >= fromDate);
        }
        if (DateTime.TryParseExact(to, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var toDate))
        {
            query = query.Where(l => l.CreatedAt < toDate.AddDays(1));
        }
        return query;
    }

    /// <summary>Échappe une valeur pour le CSV « ; » (guillemets doublés).</summary>
    internal static string Csv(string value)
    {
        if (value.Contains(';') || value.Contains('"') || value.Contains('\n'))
        {
            return $"\"{value.Replace("\"", "\"\"")}\"";
        }
        return value;
    }
}
