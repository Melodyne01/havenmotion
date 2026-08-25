namespace StudioVnl.Domain.Entities;

public enum MediaKind
{
    Video,
    Image,
}

public enum ProcessingStatus
{
    Pending,
    Processing,
    Ready,
    Failed,
}

public enum PublishStatus
{
    Draft,
    Published,
}

public enum LeadStatus
{
    New,
    Handled,
    Won,
    Lost,
}
