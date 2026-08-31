import { MediaAsset } from '../models';

/**
 * Extraits de banque vidéo — **contenu provisoire**.
 *
 * Tant que les vraies vidéos du studio ne sont pas montées, les bandes et le
 * showreel affichaient un cadre noir. On les remplit ici avec des extraits
 * libres de droits servis par le CDN de Mixkit (licence Mixkit : usage libre,
 * y compris commercial, sans attribution obligatoire).
 *
 * Ces extraits n'ont pas vocation à rester : dès qu'une vidéo est déposée dans
 * le backoffice, elle prend la place de l'extrait correspondant (côté API, le
 * seed ne pose l'extrait que si aucun média n'est encore rattaché).
 *
 * Pour remplacer un extrait : ouvrir la page indiquée par `source`, choisir un
 * autre clip et recopier l'URL `.mp4` du CDN. `npm run check:stock` (dans
 * `apps/web`) vérifie que les six liens répondent toujours.
 */
export interface StockClip {
  /** Identifiant lisible, repris dans l'id du média provisoire. */
  slug: string;
  /** Titre du clip chez la banque, pour le retrouver. */
  title: string;
  /** Page de la banque d'où vient le clip. */
  source: string;
  /** MP4 servi par le CDN de la banque. */
  url: string;
  /**
   * Poster servi par le site lui-même : il s'affiche immédiatement et reste
   * visible si le CDN est injoignable. Aucun cadre vide, donc, même hors ligne.
   */
  posterUrl: string;
  width: number;
  height: number;
  durationSec: number;
}

const MIXKIT = 'https://assets.mixkit.co/videos/preview';

export const STOCK_CLIPS = {
  showreel: {
    slug: 'showreel',
    title: 'Daytime city traffic aerial view',
    source: 'https://mixkit.co/free-stock-video/daytime-city-traffic-aerial-view-56/',
    url: `${MIXKIT}/mixkit-daytime-city-traffic-aerial-view-56-large.mp4`,
    posterUrl: '/placeholders/showreel-2026.svg',
    width: 1920,
    height: 1080,
    durationSec: 14,
  },
  mariage: {
    slug: 'mariage',
    title: 'Couple of lovers kissing in the sunset',
    source: 'https://mixkit.co/free-stock-video/couple-of-lovers-kissing-in-the-sunset-4231/',
    url: `${MIXKIT}/mixkit-couple-of-lovers-kissing-in-the-sunset-4231-large.mp4`,
    posterUrl: '/placeholders/mariage-reel.svg',
    width: 1920,
    height: 1080,
    durationSec: 16,
  },
  corporate: {
    slug: 'corporate',
    title: 'People walking in a crossing in the city',
    source: 'https://mixkit.co/free-stock-video/people-walking-in-a-crossing-in-the-city-4265/',
    url: `${MIXKIT}/mixkit-people-walking-in-a-crossing-in-the-city-4265-large.mp4`,
    posterUrl: '/placeholders/corporate-reel.svg',
    width: 1920,
    height: 1080,
    durationSec: 12,
  },
  sport: {
    slug: 'sport',
    title: 'Man running on a treadmill in a gym',
    source: 'https://mixkit.co/free-stock-video/man-running-on-a-treadmill-in-a-gym-1481/',
    url: `${MIXKIT}/mixkit-man-running-on-a-treadmill-in-a-gym-1481-large.mp4`,
    posterUrl: '/placeholders/sport-reel.svg',
    width: 1920,
    height: 1080,
    durationSec: 13,
  },
  clip: {
    slug: 'clip',
    title: 'Young woman dancing in a club with neon lights',
    source: 'https://mixkit.co/free-stock-video/young-woman-dancing-in-a-club-with-neon-lights-1229/',
    url: `${MIXKIT}/mixkit-young-woman-dancing-in-a-club-with-neon-lights-1229-large.mp4`,
    posterUrl: '/placeholders/clip-reel.svg',
    width: 1920,
    height: 1080,
    durationSec: 11,
  },
  lifestyle: {
    slug: 'lifestyle',
    title: 'White sand beach and palm trees',
    source: 'https://mixkit.co/free-stock-video/white-sand-beach-and-palm-trees-1564/',
    url: `${MIXKIT}/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4`,
    posterUrl: '/placeholders/lifestyle-reel.svg',
    width: 1920,
    height: 1080,
    durationSec: 15,
  },
} as const satisfies Record<string, StockClip>;

export type StockClipKey = keyof typeof STOCK_CLIPS;

/**
 * Média provisoire prêt à être consommé par `app-video-frame` : un seul rendu
 * MP4 muet, le poster local en repli.
 */
export function stockMedia(clip: StockClip): MediaAsset {
  return {
    id: `stock-${clip.slug}`,
    kind: 'Video',
    fileName: `${clip.slug.toUpperCase()}_BANQUE.MP4`,
    posterUrl: clip.posterUrl,
    width: clip.width,
    height: clip.height,
    durationSec: clip.durationSec,
    sizeBytes: 0,
    processingStatus: 'Ready',
    renditions: [
      { type: 'video/mp4', url: clip.url, width: clip.width, height: clip.height, muted: true },
    ],
    createdAt: '1970-01-01T00:00:00Z',
  };
}
