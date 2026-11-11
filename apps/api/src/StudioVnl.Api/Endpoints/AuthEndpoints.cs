using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Api.Auth;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Endpoints;

public static class AuthEndpoints
{
    /// <summary>Durée de validité du lien « mot de passe oublié ».</summary>
    private static readonly TimeSpan ResetLinkLifetime = TimeSpan.FromHours(1);

    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth").RequireRateLimiting("auth");

        group.MapPost("/login", LoginAsync).AddEndpointFilter<ValidationFilter<LoginRequest>>();
        group.MapPost("/refresh", RefreshAsync);
        group.MapPost("/logout", LogoutAsync);
        group.MapPost("/forgot-password", ForgotPasswordAsync)
            .AddEndpointFilter<ValidationFilter<ForgotPasswordRequest>>();
        group.MapPost("/reset-password", ResetPasswordAsync)
            .AddEndpointFilter<ValidationFilter<ResetPasswordRequest>>();
        group.MapPost("/change-password", ChangePasswordAsync)
            .AddEndpointFilter<ValidationFilter<ChangePasswordRequest>>()
            .RequireAuthorization();
    }

    private static async Task<IResult> LoginAsync(
        LoginRequest request,
        UserManager<AppUser> userManager,
        TokenService tokenService,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            return Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Identifiants refusés.");
        }
        return Results.Ok(await IssueTokensAsync(user, userManager, tokenService, db, cancellationToken));
    }

    private static async Task<IResult> RefreshAsync(
        RefreshRequest request,
        UserManager<AppUser> userManager,
        TokenService tokenService,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.RefreshToken))
        {
            return Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Jeton manquant.");
        }

        var hash = TokenService.Hash(request.RefreshToken);
        var now = DateTime.UtcNow;
        var stored = await db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash, cancellationToken);
        if (stored is null || !stored.IsActive(now))
        {
            return Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Session expirée.");
        }

        var user = await userManager.FindByIdAsync(stored.UserId);
        if (user is null)
        {
            return Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Compte introuvable.");
        }

        // Rotation : l'ancien jeton est révoqué, un nouveau est émis.
        stored.RevokedAt = now;
        var tokens = await IssueTokensAsync(user, userManager, tokenService, db, cancellationToken);
        return Results.Ok(tokens);
    }

    private static async Task<IResult> LogoutAsync(
        RefreshRequest request,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(request.RefreshToken))
        {
            var hash = TokenService.Hash(request.RefreshToken);
            await db.RefreshTokens
                .Where(t => t.TokenHash == hash && t.RevokedAt == null)
                .ExecuteUpdateAsync(
                    setters => setters.SetProperty(t => t.RevokedAt, DateTime.UtcNow),
                    cancellationToken);
        }
        return Results.NoContent();
    }

    /// <summary>
    /// Utilisateur connecté : vérifie le mot de passe actuel, pose le nouveau,
    /// ferme toutes les autres sessions et renvoie une session neuve.
    /// </summary>
    private static async Task<IResult> ChangePasswordAsync(
        ChangePasswordRequest request,
        ClaimsPrincipal principal,
        UserManager<AppUser> userManager,
        TokenService tokenService,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.FindFirstValue("sub");
        var user = userId is null ? null : await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Results.Problem(statusCode: StatusCodes.Status401Unauthorized, title: "Compte introuvable.");
        }

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
        {
            return IdentityProblem(result);
        }

        user.PasswordChangedAt = DateTime.UtcNow;
        user.PasswordResetTokenHash = null;
        user.PasswordResetExpiresAt = null;
        await userManager.UpdateAsync(user);
        await RevokeAllSessionsAsync(db, user.Id, cancellationToken);

        return Results.Ok(await IssueTokensAsync(user, userManager, tokenService, db, cancellationToken));
    }

    /// <summary>
    /// Envoie un lien de réinitialisation par e-mail. Répond toujours 202,
    /// que le compte existe ou non, pour ne pas révéler les adresses inscrites.
    /// </summary>
    private static async Task<IResult> ForgotPasswordAsync(
        ForgotPasswordRequest request,
        UserManager<AppUser> userManager,
        IEmailSender emailSender,
        IConfiguration configuration,
        ILoggerFactory loggerFactory,
        CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user?.Email is null)
        {
            return Results.Accepted();
        }

        var token = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
        user.PasswordResetTokenHash = TokenService.Hash(token);
        user.PasswordResetExpiresAt = DateTime.UtcNow.Add(ResetLinkLifetime);
        await userManager.UpdateAsync(user);

        var origin = (configuration["Site:Origin"] ?? "https://heavenmotion.be").TrimEnd('/');
        var link = $"{origin}/admin/reinitialiser-mot-de-passe"
            + $"?email={Uri.EscapeDataString(user.Email)}&token={Uri.EscapeDataString(token)}";
        var safeLink = WebUtility.HtmlEncode(link);

        await emailSender.SendAsync(
            new EmailMessage(
                user.Email,
                "Heaven Motion — réinitialiser votre mot de passe",
                $"""
                <p>Bonjour,</p>
                <p>Une demande de nouveau mot de passe a été faite pour votre accès au backoffice Heaven Motion.</p>
                <p><a href="{safeLink}">Choisir un nouveau mot de passe</a></p>
                <p>Ce lien est valable une heure et ne sert qu'une fois. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail : votre mot de passe actuel reste valable.</p>
                """),
            cancellationToken);

        loggerFactory.CreateLogger("Auth").LogInformation("Lien de réinitialisation envoyé à {Email}.", user.Email);
        return Results.Accepted();
    }

    /// <summary>Pose le nouveau mot de passe à partir du lien reçu par e-mail.</summary>
    private static async Task<IResult> ResetPasswordAsync(
        ResetPasswordRequest request,
        UserManager<AppUser> userManager,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var invalid = Results.Problem(
            statusCode: StatusCodes.Status400BadRequest,
            title: "Lien invalide ou expiré. Refaites une demande de mot de passe oublié.");

        var user = await userManager.FindByEmailAsync(request.Email);
        if (user?.PasswordResetTokenHash is null
            || user.PasswordResetExpiresAt is null
            || user.PasswordResetExpiresAt < DateTime.UtcNow)
        {
            return invalid;
        }

        var expected = Encoding.ASCII.GetBytes(user.PasswordResetTokenHash);
        var actual = Encoding.ASCII.GetBytes(TokenService.Hash(request.Token));
        if (!CryptographicOperations.FixedTimeEquals(expected, actual))
        {
            return invalid;
        }

        var result = await SetPasswordAsync(userManager, user, request.NewPassword);
        if (!result.Succeeded)
        {
            return IdentityProblem(result);
        }
        await userManager.SetLockoutEndDateAsync(user, null);
        await userManager.ResetAccessFailedCountAsync(user);
        await RevokeAllSessionsAsync(db, user.Id, cancellationToken);
        return Results.NoContent();
    }

    /// <summary>
    /// Remplace le mot de passe sans fournisseur de jetons Identity : valide
    /// d'abord (rien n'est touché si le mot de passe est refusé), puis écrit
    /// empreinte, horodatage et invalidation du lien en une seule mise à jour.
    /// </summary>
    private static async Task<IdentityResult> SetPasswordAsync(
        UserManager<AppUser> userManager,
        AppUser user,
        string newPassword)
    {
        var errors = new List<IdentityError>();
        foreach (var validator in userManager.PasswordValidators)
        {
            var validation = await validator.ValidateAsync(userManager, user, newPassword);
            if (!validation.Succeeded)
            {
                errors.AddRange(validation.Errors);
            }
        }
        if (errors.Count > 0)
        {
            return IdentityResult.Failed([.. errors]);
        }

        user.PasswordHash = userManager.PasswordHasher.HashPassword(user, newPassword);
        user.PasswordChangedAt = DateTime.UtcNow;
        user.PasswordResetTokenHash = null;
        user.PasswordResetExpiresAt = null;
        // Change le SecurityStamp et enregistre l'utilisateur.
        return await userManager.UpdateSecurityStampAsync(user);
    }

    private static Task RevokeAllSessionsAsync(AppDbContext db, string userId, CancellationToken cancellationToken) =>
        db.RefreshTokens
            .Where(t => t.UserId == userId && t.RevokedAt == null)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(t => t.RevokedAt, DateTime.UtcNow),
                cancellationToken);

    private static IResult IdentityProblem(IdentityResult result) =>
        Results.Problem(
            statusCode: StatusCodes.Status400BadRequest,
            title: string.Join(" ", result.Errors.Select(e => e.Description)));

    private static async Task<AuthTokensDto> IssueTokensAsync(
        AppUser user,
        UserManager<AppUser> userManager,
        TokenService tokenService,
        AppDbContext db,
        CancellationToken cancellationToken)
    {
        var roles = await userManager.GetRolesAsync(user);
        var role = roles.Contains("Admin") ? "Admin" : roles.FirstOrDefault() ?? "Editor";
        var now = DateTime.UtcNow;
        var expiresAt = now.Add(tokenService.AccessTokenLifetime);

        var accessToken = tokenService.CreateAccessToken(user, role, expiresAt);
        var (refreshToken, entity) = tokenService.CreateRefreshToken(user.Id, now);
        db.RefreshTokens.Add(entity);
        await db.SaveChangesAsync(cancellationToken);

        return new AuthTokensDto(
            accessToken,
            refreshToken,
            expiresAt,
            user.Email ?? string.Empty,
            role,
            MustChangePassword: user.PasswordChangedAt is null);
    }
}
