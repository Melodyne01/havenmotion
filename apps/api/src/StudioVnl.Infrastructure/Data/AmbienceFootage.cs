using StudioVnl.Application.Mapping;
using StudioVnl.Domain.Entities;

namespace StudioVnl.Infrastructure.Data;

/// <summary>
/// Boucles d'ambiance — <b>habillage provisoire</b>.
///
/// Tant qu'aucune vidéo n'a été déposée dans le backoffice, les bandes et le
/// showreel afficheraient un cadre noir. Le seed leur rattache donc une boucle
/// fabriquée pour le site (dérive lumineuse ambre sur fond charbon), servie
/// par le front depuis <c>public/ambience/</c> : aucun CDN tiers, aucun lien
/// qui puisse mourir.
///
/// La liste est le miroir de <c>apps/web/src/app/core/ambience.ts</c>, et les
/// fichiers sont produits par <c>apps/web/tools/generate-ambience.py</c>.
///
/// Ces médias ne sont posés que sur un emplacement vide : une vraie vidéo
/// rattachée depuis le backoffice n'est jamais écrasée.
/// </summary>
public static class AmbienceFootage
{
    private const int Width = 1280;
    private const int Height = 536;
    private const double DurationSec = 8;

    public static readonly AmbienceClip Showreel = new("showreel");

    public static readonly IReadOnlyDictionary<string, AmbienceClip> ByCategorySlug =
        new Dictionary<string, AmbienceClip>
        {
            ["mariage"] = new("mariage"),
            ["corporate"] = new("corporate"),
            ["sport"] = new("sport"),
            ["clip"] = new("clip"),
            ["lifestyle"] = new("lifestyle"),
        };

    /// <summary>
    /// Média provisoire prêt à insérer : un rendu WebM muet, la première image
    /// de la boucle en poster.
    /// </summary>
    public static MediaAsset ToMediaAsset(this AmbienceClip clip) => new()
    {
        Id = Guid.NewGuid(),
        Kind = MediaKind.Video,
        FileName = $"{clip.Slug.ToUpperInvariant()}_AMBIANCE.WEBM",
        OriginalPath = clip.Url,
        PosterPath = clip.PosterPath,
        RenditionsJson = DtoMapper.ToRenditionsJson(
        [
            new DtoMapper.StoredRendition("video/webm", clip.Url, Width, Height, true),
        ]),
        Width = Width,
        Height = Height,
        DurationSec = DurationSec,
        SizeBytes = 0,
        ProcessingStatus = ProcessingStatus.Ready,
        CreatedAt = DateTime.UtcNow,
    };

    /// <param name="Slug">Identifiant du plan, repris dans les noms de fichiers.</param>
    public record AmbienceClip(string Slug)
    {
        /// <summary>Boucle servie par le front, à la racine du site.</summary>
        public string Url { get; } = $"/ambience/{Slug}.webm";

        /// <summary>Première image de la boucle.</summary>
        public string PosterPath { get; } = $"/ambience/{Slug}.jpg";
    }
}
