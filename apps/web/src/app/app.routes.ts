import { Routes } from '@angular/router';
import { SITE_LOCALE } from './core/locale';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public-page.component').then((m) => m.PublicPageComponent),
  },
  {
    path: 'realisations/:slug',
    loadComponent: () =>
      import('./public/pages/category-page.component').then((m) => m.CategoryPageComponent),
  },
  {
    path: 'a-propos',
    loadComponent: () =>
      import('./public/pages/about-page.component').then((m) => m.AboutPageComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./public/pages/contact-page.component').then((m) => m.ContactPageComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./public/pages/faq-page.component').then((m) => m.FaqPageComponent),
  },
  {
    path: 'zones',
    loadComponent: () =>
      import('./public/pages/zones-page.component').then((m) => m.ZonesPageComponent),
  },
  {
    path: 'zones/:commune',
    loadComponent: () =>
      import('./public/pages/commune-page.component').then((m) => m.CommunePageComponent),
  },
  {
    // Racine FR non préfixée (marché majoritaire, aucune migration d'URL à
    // faire sur l'existant) ; le NL vit sous /nl avec ses propres slugs
    // traduits. `providers` fixe SITE_LOCALE à 'nl' pour toute la sous-arborescence
    // — les composants (partagés avec la FR) le lisent pour charger le bon
    // contenu et construire leurs liens.
    path: 'nl',
    providers: [{ provide: SITE_LOCALE, useValue: 'nl' }],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./public/public-page.component').then((m) => m.PublicPageComponent),
      },
      {
        path: 'realisaties/:slug',
        loadComponent: () =>
          import('./public/pages/category-page.component').then((m) => m.CategoryPageComponent),
      },
      {
        path: 'over-ons',
        loadComponent: () =>
          import('./public/pages/about-page.component').then((m) => m.AboutPageComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./public/pages/contact-page.component').then((m) => m.ContactPageComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./public/pages/faq-page.component').then((m) => m.FaqPageComponent),
      },
      {
        path: 'zones',
        loadComponent: () =>
          import('./public/pages/zones-page.component').then((m) => m.ZonesPageComponent),
      },
      {
        path: 'zones/:commune',
        loadComponent: () =>
          import('./public/pages/commune-page.component').then((m) => m.CommunePageComponent),
      },
      {
        path: 'wettelijke-vermeldingen',
        loadComponent: () =>
          import('./public/legal-page.component').then((m) => m.LegalPageComponent),
        data: { document: 'mentions' },
      },
      {
        path: 'privacybeleid',
        loadComponent: () =>
          import('./public/legal-page.component').then((m) => m.LegalPageComponent),
        data: { document: 'confidentialite' },
      },
      {
        // Catch-all propre à la sous-arborescence NL : sans lui, une URL NL
        // inconnue retomberait sur le `**` racine ci-dessous et perdrait la
        // langue (page 404 en français sous une URL /nl/...).
        path: '**',
        loadComponent: () =>
          import('./public/pages/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
  {
    path: 'mentions-legales',
    loadComponent: () =>
      import('./public/legal-page.component').then((m) => m.LegalPageComponent),
    data: { document: 'mentions' },
  },
  {
    path: 'confidentialite',
    loadComponent: () =>
      import('./public/legal-page.component').then((m) => m.LegalPageComponent),
    data: { document: 'confidentialite' },
  },
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
