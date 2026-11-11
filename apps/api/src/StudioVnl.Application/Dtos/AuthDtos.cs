namespace StudioVnl.Application.Dtos;

public record LoginRequest(string Email, string Password);

public record RefreshRequest(string RefreshToken);

public record AuthTokensDto(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAtUtc,
    string Email,
    string Role,
    bool MustChangePassword);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

public record ForgotPasswordRequest(string Email);

public record ResetPasswordRequest(string Email, string Token, string NewPassword);

public record AuditLogDto(
    Guid Id,
    string UserEmail,
    string Entity,
    string EntityId,
    string Action,
    string Diff,
    DateTime CreatedAt);
