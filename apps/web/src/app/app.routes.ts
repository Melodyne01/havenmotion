import { Routes } from '@angular/router';
import { ROUTE_SEGMENTS, SITE_LOCALE, SiteLocale } from './core/locale';

/**
 * Pages publiques d'une langue, avec leurs segments d'URL traduits (voir
 * `ROUTE_SEGMENTS`). Une seule fonction pour les trois langues : la liste
 * des pages est la même partout, seuls les mots changent — et une page
 * ajoutée ici existe d'office dans les trois langues.
 *
 * Exceptions : les pages zones/commune n'existent qu'en FR et NL (les
 * pages région en trois langues arrivent avec le chantier 5).
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
  ];

  if (locale !== 'en') {
    routes.push(
      {
        path: seg.zones,
        loadComponent: () =>
          import('./public/pages/zones-page.component').then((m) => m.ZonesPageComponent),
      },
      {
        path: `${seg.zones}/:commune`,
        loadComponent: () =>
          import('./public/pages/commune-page.component').then((m) => m.CommunePageComponent),
      },
    );
  }

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
