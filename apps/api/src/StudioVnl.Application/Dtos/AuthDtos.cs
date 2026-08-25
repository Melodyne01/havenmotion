namespace StudioVnl.Application.Dtos;

public record LoginRequest(string Email, string Password);

public record RefreshRequest(string RefreshToken);

public record AuthTokensDto(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAtUtc,
    string Email,
    string Role);

public record AuditLogDto(
    Guid Id,
    string UserEmail,
    string Entity,
    string EntityId,
    string Action,
    string Diff,
    DateTime CreatedAt);
