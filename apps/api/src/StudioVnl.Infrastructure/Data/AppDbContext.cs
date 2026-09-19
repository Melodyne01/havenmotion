using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<AppUser>(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Film> Films => Set<Film>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();
    public DbSet<ShowreelHistoryEntry> ShowreelHistory => Set<ShowreelHistoryEntry>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<ProcessStep> ProcessSteps => Set<ProcessStep>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<ClientLogo> ClientLogos => Set<ClientLogo>();
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<AuditLogEntry> AuditLog => Set<AuditLogEntry>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UploadSession> UploadSessions => Set<UploadSession>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => new { c.Slug, c.Locale }).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(60);
            entity.Property(c => c.Slug).HasMaxLength(60);
            entity.Property(c => c.Tagline).HasMaxLength(200);
            entity.Property(c => c.Locale).HasMaxLength(5).HasDefaultValue("fr");
            entity.HasOne(c => c.ReelMedia).WithMany().HasForeignKey(c => c.ReelMediaId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(c => c.PosterMedia).WithMany().HasForeignKey(c => c.PosterMediaId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Film>(entity =>
        {
            entity.Property(f => f.Title).HasMaxLength(160);
            entity.Property(f => f.Client).HasMaxLength(120);
            entity.Property(f => f.Duration).HasMaxLength(40);
            entity.Property(f => f.Description).HasMaxLength(2000);
            entity.HasOne(f => f.Category).WithMany(c => c.Films).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(f => f.Media).WithMany().HasForeignKey(f => f.MediaId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(f => f.PosterMedia).WithMany().HasForeignKey(f => f.PosterMediaId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<MediaAsset>(entity =>
        {
            entity.Property(m => m.FileName).HasMaxLength(255);
            entity.Property(m => m.OriginalPath).HasMaxLength(500);
            entity.Property(m => m.PosterPath).HasMaxLength(500);
        });

        builder.Entity<SiteSettings>(entity =>
        {
            entity.HasIndex(s => s.Locale).IsUnique();
            entity.Property(s => s.Locale).HasMaxLength(5).HasDefaultValue("fr");
            entity.HasOne(s => s.ShowreelMedia).WithMany().HasForeignKey(s => s.ShowreelMediaId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Service>(entity =>
        {
            entity.Property(s => s.Locale).HasMaxLength(5).HasDefaultValue("fr");
        });

        builder.Entity<ProcessStep>(entity =>
        {
            entity.Property(p => p.Locale).HasMaxLength(5).HasDefaultValue("fr");
        });

        builder.Entity<Testimonial>(entity =>
        {
            entity.Property(t => t.Locale).HasMaxLength(5).HasDefaultValue("fr");
        });

        builder.Entity<Lead>(entity =>
        {
            entity.Property(l => l.Name).HasMaxLength(120);
            entity.Property(l => l.Email).HasMaxLength(180);
            entity.Property(l => l.ProjectType).HasMaxLength(60);
            entity.Property(l => l.BudgetRange).HasMaxLength(60);
            entity.Property(l => l.Message).HasMaxLength(2000);
            entity.Property(l => l.UserAgent).HasMaxLength(400);
            entity.HasIndex(l => l.CreatedAt);
        });

        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(t => t.TokenHash).IsUnique();
            entity.Property(t => t.TokenHash).HasMaxLength(128);
        });

        builder.Entity<AuditLogEntry>(entity =>
        {
            entity.Property(a => a.Entity).HasMaxLength(80);
            entity.Property(a => a.EntityId).HasMaxLength(80);
            entity.Property(a => a.Action).HasMaxLength(40);
            entity.HasIndex(a => a.CreatedAt);
        });
    }
}
