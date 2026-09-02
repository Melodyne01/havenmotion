using Microsoft.EntityFrameworkCore;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;
using StudioVnl.Infrastructure.Email;

namespace StudioVnl.Api.Endpoints;

public static class PublicEndpoints
{
    public static void MapPublicEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/public").WithTags("Public");

        group.MapGet("/site", GetSiteAsync);
        group.MapGet("/categories", GetCategoriesAsync);
        group.MapGet("/categories/{slug}/films", GetFilmsAsync);
        group.MapPost("/leads", CreateLeadAsync)
            .RequireRateLimiting("leads")
            .AddEndpointFilter<ValidationFilter<CreateLeadRequest>>();
    }

    /// <summary>Langues supportées ; toute autre valeur retombe sur "fr".</summary>
    private static string NormalizeLocale(string? locale) => locale == "nl" ? "nl" : "fr";

    private static async Task<SitePayloadDto> GetSiteAsync(
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);

        var settings = await db.SiteSettings
            .Include(s => s.ShowreelMedia)
            .Where(s => s.Locale == loc)
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken) ?? new SiteSettings();

        var services = await db.Services.Where(s => s.Locale == loc).AsNoTracking()
            .OrderBy(s => s.SortOrder).ToListAsync(cancellationToken);
        var steps = await db.ProcessSteps.Where(p => p.Locale == loc).AsNoTracking()
            .OrderBy(s => s.SortOrder).ToListAsync(cancellationToken);
        var testimonials = await db.Testimonials.Where(t => t.Locale == loc).AsNoTracking()
            .OrderBy(t => t.SortOrder).ToListAsync(cancellationToken);
        var logos = await db.ClientLogos.AsNoTracking()
            .OrderBy(l => l.SortOrder).ToListAsync(cancellationToken);

        return new SitePayloadDto(
            new SiteSettingsDto(
                settings.BrandName,
                settings.Tagline,
                settings.Email,
                settings.Instagram,
                settings.City,
                settings.Region,
                settings.LegalText,
                settings.ShowreelMedia?.ToDto(storage.GetPublicUrl)),
            services.Select(s => s.ToDto()).ToList(),
            steps.Select(s => s.ToDto()).ToList(),
            new AboutDto(
                string.IsNullOrEmpty(settings.AboutPortraitUrl) ? null : settings.AboutPortraitUrl,
                DtoMapper.ParseStringList(settings.AboutParagraphsJson)),
            testimonials.Select(t => t.ToDto()).ToList(),
            logos.Select(l => l.ToDto()).ToList());
    }

    private static async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);

        var categories = await db.Categories
            .Include(c => c.ReelMedia)
            .Include(c => c.PosterMedia)
            .Where(c => c.IsPublished && c.Locale == loc)
            .OrderBy(c => c.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var counts = await db.Films
            .Where(f => f.Status == PublishStatus.Published)
            .GroupBy(f => f.CategoryId)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.Key, g => g.Count, cancellationToken);

        return categories
            .Select(c => c.ToDto(storage.GetPublicUrl, counts.GetValueOrDefault(c.Id)))
            .ToList();
    }

    private static async Task<IResult> GetFilmsAsync(
        string slug,
        string? locale,
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var loc = NormalizeLocale(locale);

        var category = await db.Categories.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug && c.Locale == loc && c.IsPublished, cancellationToken);
        if (category is null)
        {
            return Results.NotFound();
        }

        var films = await db.Films
            .Include(f => f.Category)
            .Include(f => f.Media)
            .Include(f => f.PosterMedia)
            .Where(f => f.CategoryId == category.Id && f.Status == PublishStatus.Published)
            .OrderBy(f => f.SortOrder)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return Results.Ok(films.Select(f => f.ToDto(storage.GetPublicUrl)).ToList());
    }

    private static async Task<IResult> CreateLeadAsync(
        CreateLeadRequest request,
        AppDbContext db,
        IEmailSender emailSender,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var lead = new Lead
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            ProjectType = request.ProjectType.Trim(),
            EventDate = string.IsNullOrEmpty(request.EventDate)
                ? null
                : DateOnly.ParseExact(request.EventDate, "yyyy-MM-dd"),
            BudgetRange = request.BudgetRange.Trim(),
            Message = request.Message?.Trim() ?? string.Empty,
            Status = LeadStatus.New,
            CreatedAt = DateTime.UtcNow,
            UserAgent = httpContext.Request.Headers.UserAgent.ToString(),
        };
        db.Leads.Add(lead);
        await db.SaveChangesAsync(cancellationToken);

        var settings = await db.SiteSettings.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
        var brandName = settings?.BrandName ?? "Heaven Motion";
        var studioAddress = settings?.Email;

        // Notification au studio + accusé de réception au prospect.
        if (!string.IsNullOrEmpty(studioAddress))
        {
            await emailSender.SendAsync(
                new EmailMessage(
                    studioAddress,
                    $"Nouvelle demande de devis — {lead.ProjectType}",
                    LeadEmailTemplates.StudioNotification(lead, brandName)),
                cancellationToken);
        }
        await emailSender.SendAsync(
            new EmailMessage(
                lead.Email,
                $"{brandName} — votre demande est bien reçue",
                LeadEmailTemplates.ProspectAcknowledgement(lead, brandName)),
            cancellationToken);

        return Results.Created($"/api/admin/leads/{lead.Id}", new { id = lead.Id });
    }
}
