import { InjectionToken } from '@angular/core';

export type SiteLocale = 'fr' | 'nl' | 'en';

/** Les trois langues du site, dans l'ordre d'affichage du sélecteur. */
export const SITE_LOCALES: readonly SiteLocale[] = ['fr', 'nl', 'en'];

/**
 * Langue de la sous-arborescence de routes courante, fixée par
 * `app.routes.ts` (providers sur les nœuds `/nl` et `/en`). Les composants
 * publics l'injectent pour savoir dans quelle langue charger le contenu et
 * construire leurs liens, sans avoir à remonter l'arbre de routes.
 */
export const SITE_LOCALE = new InjectionToken<SiteLocale>('SITE_LOCALE', {
  providedIn: 'root',
  factory: () => 'fr',
});

/** Préfixe d'URL de la langue : vide pour le FR (racine), `/nl`, `/en`. */
export function localePrefix(locale: SiteLocale): string {
  return locale === 'fr' ? '' : `/${locale}`;
}

/** Chemin de la home dans la langue donnée (`/`, `/nl`, `/en`). */
export function homePath(locale: SiteLocale): string {
  return locale === 'fr' ? '/' : `/${locale}`;
}

/**
 * Sélectionne la variante d'un texte selon la langue. Remplace les ternaires
 * `locale === 'nl' ? … : …` d'avant l'ajout de l'anglais : avec trois langues,
 * une valeur par langue est plus lisible qu'un ternaire imbriqué, et le
 * type force à fournir l'anglais partout (plus de texte FR servi sur /en
 * par oubli).
 */
export function pick<T>(locale: SiteLocale, values: Readonly<Record<SiteLocale, T>>): T {
  return values[locale];
}

/**
 * Segments d'URL traduits des pages fixes. Une seule table plutôt qu'un
 * ternaire dans chaque composant : le sélecteur de langue, les hreflang et
 * le sitemap doivent tous produire exactement les mêmes chemins.
 */
export const ROUTE_SEGMENTS: Readonly<Record<SiteLocale, Readonly<Record<RouteKey, string>>>> = {
  fr: {
    services: 'prestations',
    pricing: 'tarifs',
    about: 'a-propos',
    contact: 'contact',
    faq: 'faq',
    zones: 'zones',
    legal: 'mentions-legales',
    privacy: 'confidentialite',
  },
  nl: {
    services: 'diensten',
    pricing: 'tarieven',
    about: 'over-ons',
    contact: 'contact',
    faq: 'faq',
    zones: 'zones',
    legal: 'wettelijke-vermeldingen',
    privacy: 'privacybeleid',
  },
  en: {
    services: 'services',
    pricing: 'pricing',
    about: 'about',
    contact: 'contact',
    faq: 'faq',
    zones: 'areas',
    legal: 'legal-notice',
    privacy: 'privacy',
  },
};

export type RouteKey = 'services' | 'pricing' | 'about' | 'contact' | 'faq' | 'zones' | 'legal' | 'privacy';

/** Chemin absolu d'une page fixe dans la langue donnée (`/nl/tarieven`). */
export function routePath(locale: SiteLocale, key: RouteKey): string {
  return `${localePrefix(locale)}/${ROUTE_SEGMENTS[locale][key]}`;
}

/** Chemin absolu d'une page catégorie (`/en/services/wedding`). */
export function categoryPath(locale: SiteLocale, slug: string): string {
  return `${routePath(locale, 'services')}/${slug}`;
}

/** Ancre du formulaire de devis de la home, dans la langue donnée. */
export function contactAnchor(locale: SiteLocale): string {
  return `${homePath(locale)}${locale === 'fr' ? '' : '/'}#contact`;
}

/**
 * Correspondance des slugs FR ↔ NL ↔ EN des six catégories. Doit rester
 * synchronisée avec `CategoryLocaleMap` dans `SeedData.cs` côté API — c'est
 * la même décision de traduction, dupliquée ici uniquement parce que le
 * sélecteur de langue et les hreflang doivent pouvoir construire l'URL
 * cible sans aller-retour réseau.
 */
export const CATEGORY_SLUG_MAP: readonly Record<SiteLocale, string>[] = [
  { fr: 'evenementiel', nl: 'evenementen', en: 'events' },
  { fr: 'mariage', nl: 'huwelijk', en: 'wedding' },
  { fr: 'corporate', nl: 'zakelijk', en: 'corporate' },
  { fr: 'sport', nl: 'sport', en: 'sport' },
  { fr: 'clip', nl: 'clip', en: 'music-video' },
  { fr: 'lifestyle', nl: 'lifestyle', en: 'lifestyle' },
];

/** Identifiant neutre d'une catégorie : son slug FR, commun aux trois langues. */
export type CategoryKey = 'evenementiel' | 'mariage' | 'corporate' | 'sport' | 'clip' | 'lifestyle';

/** Retrouve la clé neutre d'une catégorie à partir de son slug dans une langue. */
export function categoryKeyFromSlug(locale: SiteLocale, slug: string): CategoryKey | null {
  const entry = CATEGORY_SLUG_MAP.find((e) => e[locale] === slug);
  return entry ? (entry.fr as CategoryKey) : null;
}

/** Slug d'une catégorie dans une langue, à partir de sa clé neutre. */
export function categorySlug(locale: SiteLocale, key: CategoryKey): string {
  return CATEGORY_SLUG_MAP.find((e) => e.fr === key)?.[locale] ?? key;
}
