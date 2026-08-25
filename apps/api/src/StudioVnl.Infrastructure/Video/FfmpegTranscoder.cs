using System.Diagnostics;
using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using StudioVnl.Application.Abstractions;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Infrastructure.Video;

public class FfmpegOptions
{
    public const string Section = "Ffmpeg";

    public string FfmpegPath { get; set; } = "ffmpeg";
    public string FfprobePath { get; set; } = "ffprobe";

    /// <summary>Hauteur maximale des rendus web.</summary>
    public int MaxHeight { get; set; } = 1080;

    /// <summary>Débit vidéo cible (kbit/s), ≤ 6 Mbps d'après le cahier des charges.</summary>
    public int VideoBitrateKbps { get; set; } = 5500;
}

/// <summary>
/// Transcodage FFmpeg : MP4 (H.264) + WebM (VP9), version muette allégée pour
/// les fonds de bande, poster extrait à 1 s.
/// </summary>
public class FfmpegTranscoder(
    IMediaStorage storage,
    IOptions<FfmpegOptions> options,
    ILogger<FfmpegTranscoder> logger) : IVideoTranscoder
{
    private readonly FfmpegOptions _options = options.Value;

    public async Task<ProcessedVideo> ProcessAsync(MediaAsset asset, CancellationToken cancellationToken)
    {
        var inputPath = await storage.GetLocalPathAsync(asset.OriginalPath, cancellationToken);
        var workDir = Path.Combine(Path.GetTempPath(), "vnl-renditions", asset.Id.ToString("N"));
        Directory.CreateDirectory(workDir);

        try
        {
            var (width, height, duration) = await ProbeAsync(inputPath, cancellationToken);
            var targetHeight = Math.Min(height, _options.MaxHeight);
            // Largeur paire exigée par l'encodeur.
            var scaleFilter = $"scale=-2:{targetHeight}";
            var bitrate = $"{_options.VideoBitrateKbps}k";

            var mp4Path = Path.Combine(workDir, "web.mp4");
            var webmPath = Path.Combine(workDir, "web.webm");
            var mutedPath = Path.Combine(workDir, "band-muted.mp4");
            var posterPath = Path.Combine(workDir, "poster.jpg");

            // Rendu principal MP4 H.264 (son conservé).
            await RunFfmpegAsync(
                $"-y -i \"{inputPath}\" -vf {scaleFilter} -c:v libx264 -preset medium -b:v {bitrate} " +
                $"-maxrate {bitrate} -bufsize {_options.VideoBitrateKbps * 2}k -pix_fmt yuv420p " +
                "-movflags +faststart -c:a aac -b:a 128k " +
                $"\"{mp4Path}\"",
                cancellationToken);

            // Rendu WebM VP9.
            await RunFfmpegAsync(
                $"-y -i \"{inputPath}\" -vf {scaleFilter} -c:v libvpx-vp9 -b:v {bitrate} -row-mt 1 " +
                $"-c:a libopus -b:a 96k \"{webmPath}\"",
                cancellationToken);

            // Version muette et allégée pour les fonds de bande (720p, sans audio).
            var bandHeight = Math.Min(height, 720);
            await RunFfmpegAsync(
                $"-y -i \"{inputPath}\" -vf scale=-2:{bandHeight} -c:v libx264 -preset medium " +
                "-b:v 2500k -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p -movflags +faststart -an " +
                $"\"{mutedPath}\"",
                cancellationToken);

            // Poster : image à 1 seconde.
            await RunFfmpegAsync(
                $"-y -ss 1 -i \"{inputPath}\" -vframes 1 -vf {scaleFilter} -q:v 3 \"{posterPath}\"",
                cancellationToken);

            var prefix = $"renditions/{asset.Id:N}";
            var renditions = new List<ProcessedRendition>();

            await UploadAsync(mp4Path, $"{prefix}/web.mp4", cancellationToken);
            renditions.Add(new ProcessedRendition("video/mp4", $"{prefix}/web.mp4", ScaledWidth(width, height, targetHeight), targetHeight, false));

            await UploadAsync(webmPath, $"{prefix}/web.webm", cancellationToken);
            renditions.Add(new ProcessedRendition("video/webm", $"{prefix}/web.webm", ScaledWidth(width, height, targetHeight), targetHeight, false));

            await UploadAsync(mutedPath, $"{prefix}/band-muted.mp4", cancellationToken);
            renditions.Add(new ProcessedRendition("video/mp4", $"{prefix}/band-muted.mp4", ScaledWidth(width, height, bandHeight), bandHeight, true));

            var posterKey = $"{prefix}/poster.jpg";
            await UploadAsync(posterPath, posterKey, cancellationToken);

            return new ProcessedVideo(renditions, posterKey, width, height, duration);
        }
        finally
        {
            try
            {
                Directory.Delete(workDir, recursive: true);
            }
            catch (IOException exception)
            {
                logger.LogWarning(exception, "Nettoyage incomplet du dossier {WorkDir}", workDir);
            }
        }
    }

    private static int ScaledWidth(int width, int height, int targetHeight)
    {
        if (height == 0)
        {
            return width;
        }
        var scaled = (int)Math.Round((double)width * targetHeight / height);
        return scaled % 2 == 0 ? scaled : scaled - 1;
    }

    private async Task UploadAsync(string localPath, string key, CancellationToken cancellationToken)
    {
        await using var stream = File.OpenRead(localPath);
        await storage.SaveAsync(key, stream, cancellationToken);
    }

    private async Task<(int Width, int Height, double Duration)> ProbeAsync(
        string inputPath,
        CancellationToken cancellationToken)
    {
        var output = await RunProcessAsync(
            _options.FfprobePath,
            $"-v quiet -print_format json -show_streams -show_format \"{inputPath}\"",
            cancellationToken);

        using var document = JsonDocument.Parse(output);
        var stream = document.RootElement.GetProperty("streams").EnumerateArray()
            .FirstOrDefault(s => s.TryGetProperty("codec_type", out var type) && type.GetString() == "video");
        if (stream.ValueKind != JsonValueKind.Object)
        {
            throw new InvalidOperationException("Aucun flux vidéo détecté dans le fichier.");
        }

        var width = stream.TryGetProperty("width", out var w) ? w.GetInt32() : 0;
        var height = stream.TryGetProperty("height", out var h) ? h.GetInt32() : 0;
        var duration = 0d;
        if (document.RootElement.TryGetProperty("format", out var format)
            && format.TryGetProperty("duration", out var d)
            && double.TryParse(d.GetString(), NumberStyles.Float, CultureInfo.InvariantCulture, out var parsed))
        {
            duration = parsed;
        }
        return (width, height, duration);
    }

    private Task RunFfmpegAsync(string arguments, CancellationToken cancellationToken) =>
        RunProcessAsync(_options.FfmpegPath, arguments, cancellationToken);

    private static async Task<string> RunProcessAsync(
        string fileName,
        string arguments,
        CancellationToken cancellationToken)
    {
        var info = new ProcessStartInfo(fileName, arguments)
        {
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
        };
        using var process = Process.Start(info)
            ?? throw new InvalidOperationException($"Impossible de démarrer {fileName}.");

        var stdout = await process.StandardOutput.ReadToEndAsync(cancellationToken);
        var stderr = await process.StandardError.ReadToEndAsync(cancellationToken);
        await process.WaitForExitAsync(cancellationToken);

        if (process.ExitCode != 0)
        {
            throw new InvalidOperationException($"{fileName} a échoué ({process.ExitCode}) : {stderr}");
        }
        return stdout;
    }
}
