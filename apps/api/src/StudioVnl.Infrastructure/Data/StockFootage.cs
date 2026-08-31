using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Infrastructure.Data;

/// <summary>
/// Extraits de banque vidéo — <b>contenu provisoire</b>.
///
/// Tant qu'aucune vidéo n'a été déposée dans le backoffice, les bandes et le
/// showreel afficheraient un cadre noir. Le seed leur rattache donc un extrait
/// libre de droits servi par le CDN de Mixkit (licence Mixkit : usage libre,
/// y compris commercial, sans attribution obligatoire).
///
/// La liste est le miroir de `apps/web/src/app/core/stock-footage.ts` : si une
/// URL change d'un côté, la changer de l'autre. `npm run check:stock` (dans
/// `apps/web`) vérifie que les liens répondent toujours.
///
/// Ces médias ne sont posés que sur un emplacement vide : dès qu'une vraie
/// vidéo est rattachée depuis le backoffice, elle n'est jamais écrasée.
/// </summary>
public static class StockFootage
{
    private const string Mixkit = "https://assets.mixkit.co/videos/preview";

    public static readonly StockClip Showreel = new(
        "showreel",
        $"{Mixkit}/mixkit-daytime-city-traffic-aerial-view-56-large.mp4",
        "/placeholders/showreel-2026.svg",
        14);

    public static readonly IReadOnlyDictionary<string, StockClip> ByCategorySlug =
        new Dictionary<string, StockClip>
        {
            ["mariage"] = new(
                "mariage",
                $"{Mixkit}/mixkit-couple-of-lovers-kissing-in-the-sunset-4231-large.mp4",
                "/placeholders/mariage-reel.svg",
                16),
            ["corporate"] = new(
                "corporate",
                $"{Mixkit}/mixkit-people-walking-in-a-crossing-in-the-city-4265-large.mp4",
                "/placeholders/corporate-reel.svg",
                12),
            ["sport"] = new(
                "sport",
                $"{Mixkit}/mixkit-man-running-on-a-treadmill-in-a-gym-1481-large.mp4",
                "/placeholders/sport-reel.svg",
                13),
            ["clip"] = new(
                "clip",
                $"{Mixkit}/mixkit-young-woman-dancing-in-a-club-with-neon-lights-1229-large.mp4",
                "/placeholders/clip-reel.svg",
                11),
            ["lifestyle"] = new(
                "lifestyle",
                $"{Mixkit}/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4",
                "/placeholders/lifestyle-reel.svg",
                15),
        };

    /// <summary>
    /// Média provisoire prêt à insérer : un seul rendu MP4 muet, le poster
    /// local en repli si le CDN de la banque ne répond pas.
    /// </summary>
    public static MediaAsset ToMediaAsset(this StockClip clip) => new()
    {
        Id = Guid.NewGuid(),
        Kind = MediaKind.Video,
        FileName = $"{clip.Slug.ToUpperInvariant()}_BANQUE.MP4",
        OriginalPath = clip.Url,
        PosterPath = clip.PosterPath,
        RenditionsJson = DtoMapper.ToRenditionsJson(
        [
            new DtoMapper.StoredRendition("video/mp4", clip.Url, 1920, 1080, true),
        ]),
        Width = 1920,
        Height = 1080,
        DurationSec = clip.DurationSec,
        SizeBytes = 0,
        ProcessingStatus = ProcessingStatus.Ready,
        CreatedAt = DateTime.UtcNow,
    };

    /// <param name="Slug">Identifiant lisible, repris dans le nom de fichier.</param>
    /// <param name="Url">MP4 servi par le CDN de la banque.</param>
    /// <param name="PosterPath">Poster servi par le front, affiché immédiatement.</param>
    /// <param name="DurationSec">Durée approximative de l'extrait.</param>
    public record StockClip(string Slug, string Url, string PosterPath, double DurationSec);
}
