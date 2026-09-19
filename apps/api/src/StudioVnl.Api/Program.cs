using System.Text;
using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using StudioVnl.Api.Auth;
using StudioVnl.Api.Endpoints;
using StudioVnl.Api.Services;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Validation;
using StudioVnl.Infrastructure.Data;
using StudioVnl.Infrastructure.Email;
using StudioVnl.Infrastructure.Storage;
using StudioVnl.Infrastructure.Video;

var builder = WebApplication.CreateBuilder(args);

// --- Journalisation --------------------------------------------------------
builder.Host.UseSerilog((context, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .WriteTo.Console());

// --- Base de données -------------------------------------------------------
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? "Host=localhost;Database=studiovnl;Username=studiovnl;Password=studiovnl";
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// --- Identité + JWT --------------------------------------------------------
builder.Services
    .AddIdentityCore<AppUser>(options =>
    {
        options.Password.RequiredLength = 10;
        options.Password.RequireNonAlphanumeric = false;
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.Section));
builder.Services.AddSingleton<TokenService>();

var jwtSection = builder.Configuration.GetSection(JwtOptions.Section).Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrEmpty(jwtSection.SigningKey))
{
    if (builder.Environment.IsProduction())
    {
        throw new InvalidOperationException("Jwt:SigningKey doit être défini en production.");
    }
    // Clé jetable en développement : les sessions sautent à chaque redémarrage.
    jwtSection.SigningKey = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(48));
    builder.Services.PostConfigure<JwtOptions>(options => options.SigningKey = jwtSection.SigningKey);
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = jwtSection.Issuer,
            ValidAudience = jwtSection.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection.SigningKey)),
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });
builder.Services.AddAuthorization();

// --- Limitation de débit : /auth et /leads --------------------------------
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("auth", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1) }));
    options.AddPolicy("leads", httpContext => RateLimitPartition.GetFixedWindowLimiter(
        httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(10) }));
});

// --- Stockage médias -------------------------------------------------------
var storageProvider = builder.Configuration["MediaStorage:Provider"] ?? "LocalDisk";
builder.Services.Configure<LocalDiskStorageOptions>(builder.Configuration.GetSection(LocalDiskStorageOptions.Section));
builder.Services.Configure<S3StorageOptions>(builder.Configuration.GetSection(S3StorageOptions.Section));
if (string.Equals(storageProvider, "S3", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddSingleton<IMediaStorage, S3MediaStorage>();
}
else
{
    builder.Services.AddSingleton<IMediaStorage, LocalDiskMediaStorage>();
}

// --- Traitement vidéo ------------------------------------------------------
builder.Services.Configure<FfmpegOptions>(builder.Configuration.GetSection(FfmpegOptions.Section));
builder.Services.AddScoped<IVideoTranscoder, FfmpegTranscoder>();
builder.Services.AddSingleton<VideoProcessingQueue>();
builder.Services.AddSingleton<IVideoProcessingQueue>(sp => sp.GetRequiredService<VideoProcessingQueue>());
builder.Services.AddHostedService<VideoProcessingService>();

// --- E-mails ---------------------------------------------------------------
builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(EmailOptions.Section));
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();

// --- Divers ----------------------------------------------------------------
builder.Services.AddValidatorsFromAssemblyContaining<CreateLeadValidator>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditTrail, AuditTrail>();
builder.Services.AddProblemDetails();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:4200"];
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins(allowedOrigins)
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

// --- Schéma + seed ---------------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.IsRelational())
    {
        await AdoptLegacySchemaAsync(db);
    }
    // Applique les migrations si elles existent, sinon crée le schéma : ce
    // dernier cas ne sert plus qu'aux tests locaux sans base pré-existante,
    // dev et prod passent désormais par `AdoptLegacySchemaAsync` + Migrate.
    if (db.Database.IsRelational() && (await db.Database.GetPendingMigrationsAsync()).Any())
    {
        await db.Database.MigrateAsync();
    }
    else
    {
        await db.Database.EnsureCreatedAsync();
    }
    await SeedData.EnsureSeededAsync(scope.ServiceProvider);
}

/// <summary>
/// Le dépôt a longtemps démarré via EnsureCreatedAsync, sans jamais poser de
/// migration : les bases déjà en service (dev, prod) ont donc tout le schéma
/// mais aucun historique `__EFMigrationsHistory`. Sans ce pont, poser la
/// première migration ferait rejouer la création de tables qui existent déjà
/// et l'API planterait au démarrage (`relation "AspNetRoles" already
/// exists`, vérifié en local). On ne fait ça qu'une fois : dès que
/// l'historique existe, cette fonction ne touche plus à rien.
/// </summary>
static async Task AdoptLegacySchemaAsync(AppDbContext db)
{
    if ((await db.Database.GetAppliedMigrationsAsync()).Any())
    {
        return;
    }

    var connection = db.Database.GetDbConnection();
    var shouldClose = connection.State != System.Data.ConnectionState.Open;
    if (shouldClose)
    {
        await connection.OpenAsync();
    }

    bool legacySchemaExists;
    try
    {
        await using var probe = connection.CreateCommand();
        probe.CommandText = "SELECT to_regclass('\"AspNetRoles\"')::text";
        legacySchemaExists = await probe.ExecuteScalarAsync() is not (null or System.DBNull);
    }
    finally
    {
        if (shouldClose)
        {
            await connection.CloseAsync();
        }
    }

    if (!legacySchemaExists)
    {
        return;
    }

    var baselineMigrationId = db.Database.GetMigrations().OrderBy(id => id, StringComparer.Ordinal).First();

    await db.Database.ExecuteSqlRawAsync(
        """
        CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
            "MigrationId" character varying(150) NOT NULL,
            "ProductVersion" character varying(32) NOT NULL,
            CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
        )
        """);

    await db.Database.ExecuteSqlRawAsync(
        """
        INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
        VALUES ({0}, '8.0.8')
        ON CONFLICT DO NOTHING
        """,
        baselineMigrationId);
}

app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseSerilogRequestLogging();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Sert les rendus quand le stockage est sur disque local.
if (app.Services.GetRequiredService<IMediaStorage>() is LocalDiskMediaStorage localStorage)
{
    Directory.CreateDirectory(localStorage.RootPath);
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(localStorage.RootPath),
        RequestPath = "/media",
    });
}

app.MapHealthChecks("/health");
app.MapPublicEndpoints();
app.MapAuthEndpoints();

var admin = app.MapGroup("/api/admin")
    .RequireAuthorization(policy => policy.RequireRole("Admin", "Editor"));
admin.MapAdminCatalogEndpoints();
admin.MapAdminMediaEndpoints();
admin.MapAdminContentEndpoints();
admin.MapAdminLeadEndpoints();

app.Run();

/// <summary>Point d'entrée exposé pour les tests d'intégration.</summary>
public partial class Program;
