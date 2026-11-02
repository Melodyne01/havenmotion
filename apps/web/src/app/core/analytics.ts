import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Mesure d'audience Umami, sur le modèle de Beetee : sans cookie, IP
 * anonymisée, donc sans bandeau de consentement. Le script est chargé dans
 * `index.html` et ne compte que sur heavenmotion.be (`data-domains`) : dev,
 * local et tests ne remontent rien. Les pages vues sont comptées par Umami
 * lui-même, y compris les navigations sans rechargement.
 *
 * Nommage : minuscules et tirets bas, une étape du devis = un événement
 * distinct, pour lire le taux de passage directement dans la vue Events.
 */

export type AnalyticsData = Record<string, string | number | boolean | null | undefined>;

interface UmamiTracker {
  track(name: string, data?: Record<string, unknown>): void;
}

/** Profondeurs de lecture mesurées, en pourcentage de la page. */
const SCROLL_MARKS = [25, 50, 75, 90] as const;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private started = false;
  private scrollDone = new Set<number>();

  /** Envoie un événement ; sans effet côté serveur ou si Umami n'est pas chargé (bloqueur, dev). */
  track(name: string, data: AnalyticsData = {}): void {
    if (!this.browser) {
      return;
    }
    const umami = (this.document.defaultView as (Window & { umami?: UmamiTracker }) | null)?.umami;
    if (!umami || typeof umami.track !== 'function') {
      return;
    }
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== '') {
        clean[key] = value;
      }
    }
    try {
      umami.track(name, clean);
    } catch {
      // Une erreur de mesure ne doit jamais casser le site.
    }
  }

  /**
   * Écouteurs globaux, posés une seule fois dans le navigateur : clics sur
   * l'e-mail et Instagram hors tunnel de devis, et profondeur de lecture,
   * remise à zéro à chaque changement de page.
   */
  start(): void {
    if (!this.browser || this.started) {
      return;
    }
    this.started = true;
    const win = this.document.defaultView!;

    this.zone.runOutsideAngular(() => {
      this.document.addEventListener(
        'click',
        (event) => {
          const anchor = (event.target as Element | null)?.closest?.('a[href]');
          // Les liens d'envoi du tunnel ont leurs propres événements (quote_submit_*).
          if (!anchor || anchor.closest('app-quote-form')) {
            return;
          }
          const href = anchor.getAttribute('href') ?? '';
          if (href.startsWith('mailto:')) {
            this.track('contact_email_click', { path: win.location.pathname });
          } else if (href.includes('instagram.com')) {
            this.track('contact_instagram_click', { path: win.location.pathname });
          }
        },
        true,
      );

      win.addEventListener(
        'scroll',
        () => {
          const root = this.document.documentElement;
          const percent = ((root.scrollTop + win.innerHeight) / (root.scrollHeight || 1)) * 100;
          for (const mark of SCROLL_MARKS) {
            if (percent >= mark && !this.scrollDone.has(mark)) {
              this.scrollDone.add(mark);
              this.track(`scroll-${mark}`, { path: win.location.pathname });
            }
          }
        },
        { passive: true },
      );
    });

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.scrollDone = new Set<number>();
    });
  }
}
