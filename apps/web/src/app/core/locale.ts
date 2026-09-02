import { InjectionToken } from '@angular/core';

export type SiteLocale = 'fr' | 'nl';

/**
 * Langue de la sous-arborescence de routes courante, fixée par
 * `app.routes.ts` (providers sur le nœud `/nl`). Les composants publics
 * l'injectent pour savoir dans quelle langue charger le contenu et
 * construire leurs liens, sans avoir à remonter l'arbre de routes.
 */
export const SITE_LOCALE = new InjectionToken<SiteLocale>('SITE_LOCALE', {
  providedIn: 'root',
  factory: () => 'fr',
});

/**
 * Correspondance slug FR ↔ NL des cinq catégories. Doit rester synchronisée
 * avec `CategoryLocaleMap` dans `SeedData.cs` côté API — c'est la même
 * décision de traduction, dupliquée ici uniquement parce que le sélecteur
 * de langue doit pouvoir construire l'URL cible sans aller-retour réseau.
 */
export const CATEGORY_SLUG_MAP: ReadonlyArray<{ fr: string; nl: string }> = [
  { fr: 'mariage', nl: 'huwelijk' },
  { fr: 'corporate', nl: 'zakelijk' },
  { fr: 'sport', nl: 'sport' },
  { fr: 'clip', nl: 'clip' },
  { fr: 'lifestyle', nl: 'lifestyle' },
];
