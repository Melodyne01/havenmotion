using Microsoft.Extensions.Options;
using StudioVnl.Application.Abstractions;

namespace StudioVnl.Infrastructure.Storage;

public class LocalDiskStorageOptions
{
    public const string Section = "MediaStorage:LocalDisk";

    /// <summary>Racine de stockage sur disque.</summary>
    public string RootPath { get; set; } = "media-store";

    /// <summary>Préfixe public sous lequel l'API sert les fichiers.</summary>
    public string PublicBaseUrl { get; set; } = "/media";
}

/// <summary>Stockage sur disque local, servi par l'API sous `/media`.</summary>
public class LocalDiskMediaStorage(IOptions<LocalDiskStorageOptions> options) : IMediaStorage
{
    private readonly LocalDiskStorageOptions _options = options.Value;

    public async Task<string> SaveAsync(string key, Stream content, CancellationToken cancellationToken)
    {
        var path = Resolve(key);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        await using var file = File.Create(path);
        await content.CopyToAsync(file, cancellationToken);
        return key;
    }

    public Task<Stream> OpenReadAsync(string key, CancellationToken cancellationToken) =>
        Task.FromResult<Stream>(File.OpenRead(Resolve(key)));

    public Task DeleteAsync(string key, CancellationToken cancellationToken)
    {
        var path = Resolve(key);
        if (File.Exists(path))
        {
            File.Delete(path);
        }
        return Task.CompletedTask;
    }

    public string GetPublicUrl(string key) =>
        MediaKeys.IsAlreadyPublic(key)
            ? key
            : $"{_options.PublicBaseUrl.TrimEnd('/')}/{key.Replace('\\', '/')}";

    public Task<string> GetLocalPathAsync(string key, CancellationToken cancellationToken) =>
        Task.FromResult(Resolve(key));

    /// <summary>Racine absolue, exposée pour le middleware de fichiers statiques.</summary>
    public string RootPath => Path.GetFullPath(_options.RootPath);

    private string Resolve(string key)
    {
        var root = RootPath;
        var path = Path.GetFullPath(Path.Combine(root, key));
        // Bloque toute clé qui tenterait de sortir de la racine (../../…).
        if (!path.StartsWith(root, StringComparison.Ordinal))
        {
            throw new InvalidOperationException($"Clé de stockage invalide : {key}");
        }
        return path;
    }
}
