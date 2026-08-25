using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Api.Auth;
using StudioVnl.Application.Dtos;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth").RequireRateLimiting("auth");

        group.MapPost("/login", LoginAsync).AddEndpointFilter<ValidationFilter<LoginRequest>>();
        group.MapPost("/refresh", RefreshAsync);
        group.MapPost("/logout", LogoutAsync);
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

        return new AuthTokensDto(accessToken, refreshToken, expiresAt, user.Email ?? string.Empty, role);
    }
}
