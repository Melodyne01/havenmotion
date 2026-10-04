import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS, SITE_LOCALE, SiteLocale } from './core/locale';

/**
 * Pages publiques d'une langue, avec leurs segments d'URL traduits (voir
 * `ROUTE_SEGMENTS`). Une seule fonction pour les trois langues : la liste
 * des pages est la même partout, seuls les mots changent — et une page
 * ajoutée ici existe d'office dans les trois langues.
 *
 * Les pages région (`zones/:pays/:region`) ne sont rendues que pour les
 * régions qui ont un contenu dans la langue (voir `region-content.ts`) ;
 * les autres retombent sur la 404 de la sous-arborescence.
 */
function publicRoutes(locale: SiteLocale): Routes {
  const seg = ROUTE_SEGMENTS[locale];
  const routes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./public/public-page.component').then((m) => m.PublicPageComponent),
    },
    {
      path: `${seg.services}/:slug`,
      loadComponent: () =>
        import('./public/pages/category-page.component').then((m) => m.CategoryPageComponent),
    },
    {
      path: seg.pricing,
      loadComponent: () =>
        import('./public/pages/pricing-page.component').then((m) => m.PricingPageComponent),
    },
    {
      path: seg.about,
      loadComponent: () =>
        import('./public/pages/about-page.component').then((m) => m.AboutPageComponent),
    },
    {
      path: seg.contact,
      loadComponent: () =>
        import('./public/pages/contact-page.component').then((m) => m.ContactPageComponent),
    },
    {
      path: seg.faq,
      loadComponent: () =>
        import('./public/pages/faq-page.component').then((m) => m.FaqPageComponent),
    },
    {
      path: seg.legal,
      loadComponent: () =>
        import('./public/legal-page.component').then((m) => m.LegalPageComponent),
      data: { document: 'mentions' },
    },
    {
      path: seg.privacy,
      loadComponent: () =>
        import('./public/legal-page.component').then((m) => m.LegalPageComponent),
      data: { document: 'confidentialite' },
    },
    {
      path: seg.onePerson,
      loadComponent: () =>
        import('./public/pages/one-person-page.component').then((m) => m.OnePersonPageComponent),
    },
    {
      path: seg.zones,
      loadComponent: () =>
        import('./public/pages/zones-page.component').then((m) => m.ZonesPageComponent),
    },
    {
      path: `${seg.zones}/:pays`,
      loadComponent: () =>
        import('./public/pages/country-page.component').then((m) => m.CountryPageComponent),
    },
    {
      path: `${seg.zones}/:pays/:region`,
      loadComponent: () =>
        import('./public/pages/region-page.component').then((m) => m.RegionPageComponent),
    },
  ];

  // Anciennes adresses des pages catégorie (`/realisations/…`), remplacées
  // par `/prestations/…` avec l'arrivée des packs. Le serveur répond déjà
  // par un 301 (voir `server.ts`) ; cette redirection couvre la navigation
  // côté client depuis un lien externe encore ancien.
  const legacyServices = { fr: 'realisations', nl: 'realisaties', en: null }[locale];
  if (legacyServices) {
    routes.push({ path: `${legacyServices}/:slug`, redirectTo: `${seg.services}/:slug` });
  }

  return routes;
}

/**
 * Racine FR non préfixée (marché majoritaire, aucune migration d'URL à
 * faire sur l'existant) ; le NL vit sous /nl et l'EN sous /en avec leurs
 * propres slugs traduits. `providers` fixe SITE_LOCALE pour toute la
 * sous-arborescence — les composants (partagés entre les langues) le
 * lisent pour charger le bon contenu et construire leurs liens.
 */
function localizedSubtree(locale: 'nl' | 'en'): Routes[number] {
  return {
    path: locale,
    providers: [{ provide: SITE_LOCALE, useValue: locale }],
    children: [
      ...publicRoutes(locale),
      {
        // Catch-all propre à la sous-arborescence : sans lui, une URL
        // inconnue retomberait sur le `**` racine ci-dessous et perdrait
        // la langue (page 404 en français sous une URL /nl/… ou /en/…).
        path: '**',
        loadComponent: () =>
          import('./public/pages/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  };
}

export const routes: Routes = [
  ...publicRoutes('fr'),
  localizedSubtree('nl'),
  localizedSubtree('en'),
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    // Vraie page 404 plutôt qu'une redirection silencieuse vers la home :
    // le statut HTTP correspondant (404) est posé côté serveur dans
    // `app.routes.server.ts`, sur ce même `**`.
    path: '**',
    loadComponent: () =>
      import('./public/pages/not-found.component').then((m) => m.NotFoundComponent),
  },
];
