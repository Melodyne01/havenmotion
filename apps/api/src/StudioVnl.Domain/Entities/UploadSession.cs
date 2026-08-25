namespace StudioVnl.Domain.Entities;

/// <summary>Session d'upload par morceaux ouverte par le backoffice.</summary>
public class UploadSession
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public int TotalChunks { get; set; }
    public int ReceivedChunks { get; set; }
    public DateTime CreatedAt { get; set; }
}
