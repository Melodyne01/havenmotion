namespace StudioVnl.Domain.Entities;

public class Service
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    /// <summary>Éléments inclus, sérialisés en JSON (liste de chaînes).</summary>
    public string IncludedJson { get; set; } = "[]";

    public string Duration { get; set; } = string.Empty;
    public string Deliverables { get; set; } = string.Empty;
    public string StartingPrice { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class ProcessStep
{
    public Guid Id { get; set; }
    public string Index { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class Testimonial
{
    public Guid Id { get; set; }
    public string Quote { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class ClientLogo
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
}
