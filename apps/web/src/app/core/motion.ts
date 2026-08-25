/**
 * Aides « motion ». Chaque animation doit pouvoir s'éteindre : préférence
 * système `prefers-reduced-motion` et mode économie de données.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** Vrai si le navigateur signale une connexion limitée ou le mode data saver. */
export function prefersLightMedia(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) {
    return false;
  }
  if (connection.saveData) {
    return true;
  }
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
}
