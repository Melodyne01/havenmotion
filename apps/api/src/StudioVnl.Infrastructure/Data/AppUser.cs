using Microsoft.AspNetCore.Identity;

namespace StudioVnl.Infrastructure.Data;

/// <summary>Compte du backoffice (rôles : Admin, Editor).</summary>
public class AppUser : IdentityUser
{
    /// <summary>
    /// Dernière fois que l'utilisateur a choisi lui-même son mot de passe
    /// (changement depuis « Mon compte » ou lien « mot de passe oublié »).
    /// <c>null</c> : le compte tourne encore sur le mot de passe par défaut,
    /// le backoffice exige d'en choisir un nouveau.
    /// </summary>
    public DateTime? PasswordChangedAt { get; set; }

    /// <summary>Empreinte SHA-256 du jeton « mot de passe oublié » en cours (usage unique).</summary>
    public string? PasswordResetTokenHash { get; set; }

    public DateTime? PasswordResetExpiresAt { get; set; }
}
