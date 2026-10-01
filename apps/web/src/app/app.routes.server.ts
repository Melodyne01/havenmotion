import { RenderMode, ServerRoute } from '@angular/ssr';
import { ROUTE_SEGMENTS, SITE_LOCALES, SiteLocale, localePrefix } from './core/locale';

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
 * La liste est dérivée des mêmes `ROUTE_SEGMENTS` que `app.routes.ts` :
 * les deux ne peuvent plus se désynchroniser.
 */
function serverRoutesFor(locale: SiteLocale): ServerRoute[] {
  const prefix = localePrefix(locale);
  const seg = ROUTE_SEGMENTS[locale];
  const at = (segment: string) => (segment ? `${prefix}/${segment}` : prefix || '');
  const paths = [
    at(''),
    at(`${seg.services}/:slug`),
    at(seg.pricing),
    at(seg.about),
    at(seg.contact),
    at(seg.faq),
    at(seg.legal),
    at(seg.privacy),
  ];
  if (locale !== 'en') {
    paths.push(at(seg.zones), at(`${seg.zones}/:commune`));
  }
  const legacyServices = { fr: 'realisations', nl: 'realisaties', en: null }[locale];
  if (legacyServices) {
    paths.push(at(`${legacyServices}/:slug`));
  }
  return paths.map((path) => ({ path: path === '' ? '' : path.replace(/^\//, ''), renderMode: RenderMode.Server }));
}

export const serverRoutes: ServerRoute[] = [
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  ...SITE_LOCALES.flatMap(serverRoutesFor),

  // Toute URL qui ne correspond à aucune page ci-dessus : vrai 404, pas un
  // contenu de remplacement servi avec un statut 200.
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
