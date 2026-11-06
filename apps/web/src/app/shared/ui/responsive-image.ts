import { MediaAsset } from '../../models';
import { SiteLocale } from '../../core/locale';

/** Attributs d'une balise `<img>` responsive. */
export interface ResponsiveImage {
  src: string;
  /** `url 800w, url 1600w, …` ; vide pour une image non déclinée. */
  srcset: string;
  /** Dimensions intrinsèques : réservent la place avant le chargement (pas de saut de mise en page). */
  width: number | null;
  height: number | null;
}

/**
 * Attributs `<img>` d'une photo de la bibliothèque. Une photo optimisée par le
 * serveur porte des déclinaisons WebP (800, 1600, 2400 px) : le navigateur
 * choisit la plus légère qui couvre l'écran. Une image plus ancienne, ou un
 * AVIF servi tel quel, retombe sur son unique fichier.
 *
 * @param preferredWidth largeur du `src` par défaut (navigateurs sans `srcset`, robots).
 */
export function responsiveImage(asset: MediaAsset | null | undefined, preferredWidth = 1600): ResponsiveImage | null {
  if (!asset) {
    return null;
  }
  const variants = asset.renditions
    .filter((r) => r.type.startsWith('image/'))
    .sort((a, b) => a.width - b.width);

  if (variants.length === 0) {
    const src = asset.posterUrl ?? asset.renditions[0]?.url;
    if (!src) {
      return null;
    }
    return {
      src,
      srcset: '',
      width: asset.width > 0 ? asset.width : null,
      height: asset.height > 0 ? asset.height : null,
    };
  }

  const fallback = variants.find((v) => v.width >= preferredWidth) ?? variants[variants.length - 1];
  return {
    src: fallback.url,
    srcset: variants.map((v) => `${v.url} ${v.width}w`).join(', '),
    width: fallback.width,
    height: fallback.height,
  };
}

/** Texte alternatif saisi dans le backoffice pour cette langue, sinon `fallback` (titre de la page). */
export function imageAlt(asset: MediaAsset | null | undefined, locale: SiteLocale, fallback: string): string {
  const alt = asset?.alt?.[locale]?.trim();
  return alt ? alt : fallback;
}
