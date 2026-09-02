import { Injectable, signal } from '@angular/core';
import { SiteLocale } from '../core/locale';

/**
 * Langue actuellement éditée dans le backoffice. Partagée entre l'en-tête
 * (sélecteur) et les écrans de contenu (catégories, contenus texte) : un
 * simple signal suffit, pas besoin de la faire transiter par les routes
 * puisque l'admin n'a pas de sous-arborescence par langue comme le site
 * public.
 */
@Injectable({ providedIn: 'root' })
export class AdminLocaleService {
  private readonly current = signal<SiteLocale>('fr');

  readonly locale = this.current.asReadonly();

  set(locale: SiteLocale): void {
    this.current.set(locale);
  }
}
