using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Application;
using StudioVnl.Application.Abstractions;
using StudioVnl.Application.Dtos;
using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;
using StudioVnl.Infrastructure.Data;

namespace StudioVnl.Api.Endpoints;

/// <summary>Projets réels (mariages, tournages) : création, édition, publication, ordre.</summary>
public static class AdminProjectEndpoints
{
    public static void MapAdminProjectEndpoints(this RouteGroupBuilder admin)
    {
        var projects = admin.MapGroup("/projects").WithTags("Admin · Projets");
        projects.MapGet("/", ListAsync);
        projects.MapPost("/", CreateAsync)
            .AddEndpointFilter<ValidationFilter<SaveProjectRequest>>();
        projects.MapPut("/reorder", ReorderAsync);
        projects.MapPut("/{id:guid}", UpdateAsync)
            .AddEndpointFilter<ValidationFilter<SaveProjectRequest>>();
        projects.MapDelete("/{id:guid}", DeleteAsync);
    }

    private static async Task<IReadOnlyList<ProjectDto>> ListAsync(
        AppDbContext db,
        IMediaStorage storage,
        CancellationToken cancellationToken)
    {
        var projects = await Query(db).OrderBy(p => p.SortOrder).ThenByDescending(p => p.Date).ToListAsync(cancellationToken);
        var gallery = await LoadGalleryAsync(db, projects, cancellationToken);
        return projects.Select(p => p.ToDto(storage.GetPublicUrl, gallery)).ToList();
    }

    private static async Task<IResult> CreateAsync(
        SaveProjectRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        if (await db.Projects.AnyAsync(p => p.Slug == request.Slug, cancellationToken))
        {
            return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Ce slug existe déjà.");
        }

        var project = new Project { Id = Guid.NewGuid(), CreatedAt = DateTime.UtcNow };
        Apply(project, request);
        project.SortOrder = 1 + await db.Projects.CountAsync(cancellationToken);
        db.Projects.Add(project);
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync("Project", project.Id.ToString(), "Create", JsonSerializer.Serialize(request), cancellationToken);
        return Results.Created($"/api/admin/projects/{project.Id}", await LoadDtoAsync(project.Id, db, storage, cancellationToken));
    }

    private static async Task<IResult> UpdateAsync(
        Guid id,
        SaveProjectRequest request,
        AppDbContext db,
        IMediaStorage storage,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (project is null)
        {
            return Results.NotFound();
        }
        if (await db.Projects.AnyAsync(p => p.Slug == request.Slug && p.Id != id, cancellationToken))
        {
            return Results.Problem(statusCode: StatusCodes.Status400BadRequest, title: "Ce slug existe déjà.");
        }

        Apply(project, request);
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync("Project", id.ToString(), "Update", JsonSerializer.Serialize(request), cancellationToken);
        return Results.Ok(await LoadDtoAsync(id, db, storage, cancellationToken));
    }

    private static async Task<IResult> DeleteAsync(
        Guid id,
        AppDbContext db,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var deleted = await db.Projects.Where(p => p.Id == id).ExecuteDeleteAsync(cancellationToken);
        if (deleted == 0)
        {
            return Results.NotFound();
        }
        await audit.RecordAsync("Project", id.ToString(), "Delete", string.Empty, cancellationToken);
        return Results.NoContent();
    }

    private static async Task<IResult> ReorderAsync(
        ReorderRequest request,
        AppDbContext db,
        IAuditTrail audit,
        CancellationToken cancellationToken)
    {
        var projects = await db.Projects.Where(p => request.Ids.Contains(p.Id)).ToListAsync(cancellationToken);
        var order = request.Ids.Select((id, index) => (id, index)).ToDictionary(x => x.id, x => x.index);
        foreach (var project in projects)
        {
            project.SortOrder = order[project.Id] + 1;
        }
        await db.SaveChangesAsync(cancellationToken);
        await audit.RecordAsync("Project", "*", "Reorder", string.Join(",", request.Ids), cancellationToken);
        return Results.NoContent();
    }

    private static void Apply(Project project, SaveProjectRequest request)
    {
        project.Slug = request.Slug.Trim();
        project.CategoryKey = request.CategoryKey.Trim();
        project.RegionId = request.RegionId.Trim();
        project.Venue = request.Venue.Trim();
        project.City = request.City.Trim();
        project.CountryCode = request.CountryCode.Trim().ToUpperInvariant();
        project.Date = string.IsNullOrEmpty(request.Date) ? null : DateOnly.ParseExact(request.Date, "yyyy-MM-dd");
        project.Pack = request.Pack.Trim();
        project.TitleFr = request.Fr.Title.Trim();
        project.SummaryFr = request.Fr.Summary.Trim();
        project.BodyFr = request.Fr.Body.Trim();
        project.TitleNl = request.Nl.Title.Trim();
        project.SummaryNl = request.Nl.Summary.Trim();
        project.BodyNl = request.Nl.Body.Trim();
        project.TitleEn = request.En.Title.Trim();
        project.SummaryEn = request.En.Summary.Trim();
        project.BodyEn = request.En.Body.Trim();
        project.CoverMediaId = request.Cover?.Id;
        project.VideoMediaId = request.Video?.Id;
        project.GalleryJson = JsonSerializer.Serialize(request.Gallery);
        project.IsFeatured = request.IsFeatured;
        project.Status = Enum.Parse<PublishStatus>(request.Status);
    }

    private static IQueryable<Project> Query(AppDbContext db) =>
        db.Projects.Include(p => p.CoverMedia).Include(p => p.VideoMedia).AsNoTracking();

    private static async Task<ProjectDto> LoadDtoAsync(Guid id, AppDbContext db, IMediaStorage storage, CancellationToken cancellationToken)
    {
        var project = await Query(db).FirstAsync(p => p.Id == id, cancellationToken);
        var gallery = await LoadGalleryAsync(db, [project], cancellationToken);
        return project.ToDto(storage.GetPublicUrl, gallery);
    }

    /// <summary>Charge en une requête tous les médias de galerie des projets donnés.</summary>
    internal static async Task<IReadOnlyDictionary<Guid, MediaAsset>> LoadGalleryAsync(
        AppDbContext db,
        IReadOnlyList<Project> projects,
        CancellationToken cancellationToken)
    {
        var ids = projects.SelectMany(p => DtoMapper.ParseGuidList(p.GalleryJson)).Distinct().ToList();
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, MediaAsset>();
        }
        return await db.MediaAssets.AsNoTracking()
            .Where(m => ids.Contains(m.Id))
            .ToDictionaryAsync(m => m.Id, cancellationToken);
    }
}
