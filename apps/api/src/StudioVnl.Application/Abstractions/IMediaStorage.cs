namespace StudioVnl.Application.Abstractions;

/// <summary>
/// Stockage des fichiers médias. Deux implémentations : disque local (dev,
/// petit VPS) et objet compatible S3 (MinIO, AWS, Azure via passerelle).
/// </summary>
public interface IMediaStorage
{
    /// <summary>Écrit un flux et renvoie la clé de stockage.</summary>
    Task<string> SaveAsync(string key, Stream content, CancellationToken cancellationToken);

    Task<Stream> OpenReadAsync(string key, CancellationToken cancellationToken);

    Task DeleteAsync(string key, CancellationToken cancellationToken);

    /// <summary>URL publique (CDN) pour les rendus, signée pour les originaux.</summary>
    string GetPublicUrl(string key);

    /// <summary>Chemin local si le fichier est sur disque, sinon copie temporaire.</summary>
    Task<string> GetLocalPathAsync(string key, CancellationToken cancellationToken);
}
