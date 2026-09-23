import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Le contenu public vient de l'API : il est rendu à la demande pour qu'une
 * modification faite dans le backoffice soit visible sans redéploiement.
 * Le backoffice, lui, n'a rien à faire pré-rendre.
 *
 * Chaque route publique réelle est listée explicitement, plutôt qu'un seul
 * `**` couvrant tout le hors-admin : c'est la seule façon pour `@angular/ssr`
 * de distinguer "une vraie page" d'une "URL qui n'existe pas" — sans ça, le
 * `**` final (qui doit renvoyer un vrai 404) intercepterait aussi bien les
 * pages réelles, qui se retrouveraient alors servies avec un statut 404.
 * Cette liste doit rester synchronisée avec `app.routes.ts`.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  { path: '', renderMode: RenderMode.Server },
  { path: 'realisations/:slug', renderMode: RenderMode.Server },
  { path: 'a-propos', renderMode: RenderMode.Server },
  { path: 'contact', renderMode: RenderMode.Server },
  { path: 'faq', renderMode: RenderMode.Server },
  { path: 'zones', renderMode: RenderMode.Server },
  { path: 'zones/:commune', renderMode: RenderMode.Server },
  { path: 'mentions-legales', renderMode: RenderMode.Server },
  { path: 'confidentialite', renderMode: RenderMode.Server },

  { path: 'nl', renderMode: RenderMode.Server },
  { path: 'nl/realisaties/:slug', renderMode: RenderMode.Server },
  { path: 'nl/over-ons', renderMode: RenderMode.Server },
  { path: 'nl/contact', renderMode: RenderMode.Server },
  { path: 'nl/faq', renderMode: RenderMode.Server },
  { path: 'nl/zones', renderMode: RenderMode.Server },
  { path: 'nl/zones/:commune', renderMode: RenderMode.Server },
  { path: 'nl/wettelijke-vermeldingen', renderMode: RenderMode.Server },
  { path: 'nl/privacybeleid', renderMode: RenderMode.Server },

  // Toute URL qui ne correspond à aucune page ci-dessus : vrai 404, pas un
  // contenu de remplacement servi avec un statut 200.
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
