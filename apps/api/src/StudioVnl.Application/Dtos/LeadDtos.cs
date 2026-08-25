namespace StudioVnl.Application.Dtos;

/// <summary>Demande de devis envoyée par le site. `Website` est le pot de miel.</summary>
public record CreateLeadRequest(
    string Name,
    string Email,
    string ProjectType,
    string? EventDate,
    string BudgetRange,
    string? Message,
    string? Website);

public record LeadDto(
    Guid Id,
    string Name,
    string Email,
    string ProjectType,
    string? EventDate,
    string BudgetRange,
    string Message,
    string Status,
    DateTime CreatedAt,
    string UserAgent);

public record UpdateLeadStatusRequest(string Status);
