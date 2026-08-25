namespace StudioVnl.Domain.Entities;

/// <summary>Jeton de rafraîchissement : révocable, à usage unique, lié à un compte.</summary>
public class RefreshToken
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? RevokedAt { get; set; }

    public bool IsActive(DateTime now) => RevokedAt is null && now < ExpiresAt;
}
