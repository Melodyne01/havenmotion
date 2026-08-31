import { MediaAsset } from '../models';

/**
 * Boucles d'ambiance — **habillage provisoire**.
 *
 * Tant que les films du studio ne sont pas montés, les bandes et le showreel
 * afficheraient un cadre noir. On les remplit avec des boucles fabriquées pour
 * le site (`tools/generate-ambience.py`) : dérive lumineuse ambre sur fond
 * charbon, grain argentique, halo anamorphique.
 *
 * Elles sont servies par le site lui-même, depuis `public/ambience/`. Aucun
 * CDN tiers, donc aucun lien qui puisse mourir, et le rendu est identique hors
 * ligne. Ce n'est pas de la prise de vue : c'est un habillage assumé, qui
 * disparaît dès qu'une vraie vidéo est déposée dans le backoffice.
 *
 * Format : VP8/WebM, muet, 8 s bouclées. Les navigateurs sans WebM (iOS
 * antérieur à 14.4) retombent sur le poster, qui est la première image de la
 * boucle — le cadre reste habillé, il ne bouge simplement pas.
 */
export interface AmbienceClip {
  /** Identifiant du plan, repris dans les noms de fichiers. */
  slug: string;
  /** Boucle VP8/WebM servie par le site. */
  url: string;
  /** Première image de la boucle, affichée tout de suite. */
  posterUrl: string;
}

function clip(slug: string): AmbienceClip {
  return {
    slug,
    url: `/ambience/${slug}.webm`,
    posterUrl: `/ambience/${slug}.jpg`,
  };
}

export const AMBIENCE_CLIPS = {
  showreel: clip('showreel'),
  mariage: clip('mariage'),
  corporate: clip('corporate'),
  sport: clip('sport'),
  clip: clip('clip'),
  lifestyle: clip('lifestyle'),
} as const satisfies Record<string, AmbienceClip>;

/** Dimensions des boucles, alignées sur le cadre 2.39:1 du site. */
const WIDTH = 1280;
const HEIGHT = 536;
const DURATION_SEC = 8;

/** Média provisoire prêt à être consommé par `app-video-frame`. */
export function ambienceMedia(source: AmbienceClip): MediaAsset {
  return {
    id: `ambience-${source.slug}`,
    kind: 'Video',
    fileName: `${source.slug.toUpperCase()}_AMBIANCE.WEBM`,
    posterUrl: source.posterUrl,
    width: WIDTH,
    height: HEIGHT,
    durationSec: DURATION_SEC,
    sizeBytes: 0,
    processingStatus: 'Ready',
    renditions: [
      { type: 'video/webm', url: source.url, width: WIDTH, height: HEIGHT, muted: true },
    ],
    createdAt: '1970-01-01T00:00:00Z',
  };
}
