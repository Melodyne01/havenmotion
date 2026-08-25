import { InjectionToken, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface AppConfig {
  /** Racine de l'API .NET. */
  apiBaseUrl: string;
  /** Origine publique du site, utilisée pour les URL canoniques et le JSON-LD. */
  siteOrigin: string;
}

declare global {
  interface Window {
    __VNL_CONFIG__?: Partial<AppConfig>;
  }
}

/**
 * Configuration résolue au runtime.
 *
 * Navigateur : `public/config.js` (réécrit au démarrage du conteneur à partir
 * des variables d'environnement) pose `window.__VNL_CONFIG__`.
 * SSR : le serveur Node fournit sa propre valeur via `app.config.server.ts`.
 * Aucun secret ici — uniquement des URL publiques.
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => {
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    const runtime = isBrowser ? (window.__VNL_CONFIG__ ?? {}) : {};
    return {
      apiBaseUrl: runtime.apiBaseUrl ?? environment.apiBaseUrl,
      siteOrigin: runtime.siteOrigin ?? environment.siteOrigin,
    };
  },
});
