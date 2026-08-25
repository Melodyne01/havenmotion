using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using StudioVnl.Application.Abstractions;

namespace StudioVnl.Infrastructure.Storage;

public class S3StorageOptions
{
    public const string Section = "MediaStorage:S3";

    public string ServiceUrl { get; set; } = string.Empty;
    public string Bucket { get; set; } = "vnl-media";
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;

    /// <summary>URL du CDN devant le bucket ; à défaut, URL signées.</summary>
    public string? CdnBaseUrl { get; set; }

    /// <summary>Durée de validité des URL signées, en minutes.</summary>
    public int SignedUrlMinutes { get; set; } = 60;
}

/// <summary>Stockage objet compatible S3 (MinIO en dev, S3/compatible en prod).</summary>
public class S3MediaStorage : IMediaStorage, IDisposable
{
    private readonly S3StorageOptions _options;
    private readonly AmazonS3Client _client;

    public S3MediaStorage(IOptions<S3StorageOptions> options)
    {
        _options = options.Value;
        var config = new AmazonS3Config
        {
            ServiceURL = _options.ServiceUrl,
            // MinIO ne gère pas l'adressage par sous-domaine de bucket.
            ForcePathStyle = true,
        };
        _client = new AmazonS3Client(_options.AccessKey, _options.SecretKey, config);
    }

    public async Task<string> SaveAsync(string key, Stream content, CancellationToken cancellationToken)
    {
        var request = new PutObjectRequest
        {
            BucketName = _options.Bucket,
            Key = key,
            InputStream = content,
        };
        await _client.PutObjectAsync(request, cancellationToken);
        return key;
    }

    public async Task<Stream> OpenReadAsync(string key, CancellationToken cancellationToken)
    {
        var response = await _client.GetObjectAsync(_options.Bucket, key, cancellationToken);
        return response.ResponseStream;
    }

    public Task DeleteAsync(string key, CancellationToken cancellationToken) =>
        _client.DeleteObjectAsync(_options.Bucket, key, cancellationToken);

    public string GetPublicUrl(string key)
    {
        if (!string.IsNullOrEmpty(_options.CdnBaseUrl))
        {
            return $"{_options.CdnBaseUrl.TrimEnd('/')}/{key}";
        }
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _options.Bucket,
            Key = key,
            Expires = DateTime.UtcNow.AddMinutes(_options.SignedUrlMinutes),
        };
        return _client.GetPreSignedURL(request);
    }

    public async Task<string> GetLocalPathAsync(string key, CancellationToken cancellationToken)
    {
        // FFmpeg travaille sur des fichiers locaux : on rapatrie une copie.
        var temp = Path.Combine(Path.GetTempPath(), "vnl-transcode", key.Replace('/', '_'));
        Directory.CreateDirectory(Path.GetDirectoryName(temp)!);
        await using var source = await OpenReadAsync(key, cancellationToken);
        await using var target = File.Create(temp);
        await source.CopyToAsync(target, cancellationToken);
        return temp;
    }

    public void Dispose() => _client.Dispose();
}
