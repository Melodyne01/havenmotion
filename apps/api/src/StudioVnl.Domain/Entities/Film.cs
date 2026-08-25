namespace StudioVnl.Domain.Entities;

public class Film
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Client { get; set; } = string.Empty;
    public DateOnly? Date { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid? MediaId { get; set; }
    public MediaAsset? Media { get; set; }
    public Guid? PosterMediaId { get; set; }
    public MediaAsset? PosterMedia { get; set; }
    public int SortOrder { get; set; }
    public bool IsFeatured { get; set; }
    public PublishStatus Status { get; set; } = PublishStatus.Draft;
}
