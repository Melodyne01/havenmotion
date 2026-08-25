import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Le contenu public vient de l'API : il est rendu à la demande pour qu'une
 * modification faite dans le backoffice soit visible sans redéploiement.
 * Le backoffice, lui, n'a rien à faire pré-rendre.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
