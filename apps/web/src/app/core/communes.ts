export interface CommuneInfo {
  readonly slugFr: string;
  readonly slugNl: string;
  readonly nameFr: string;
  readonly nameNl: string;
  readonly postalCode: string;
  readonly landmarkFr: string;
  readonly landmarkNl: string;
}

/**
 * Les 19 communes de la Région de Bruxelles-Capitale : une liste
 * administrative fixe qui ne change pas, d'où un dictionnaire statique
 * plutôt qu'une entité en base (comme `CATEGORY_SLUG_MAP`) — rien à gérer
 * depuis le backoffice, aucun aller-retour API pour construire ces pages
 * ou le lien FR/NL équivalent.
 */
export const COMMUNES: readonly CommuneInfo[] = [
  { slugFr: 'bruxelles-ville', slugNl: 'stad-brussel', nameFr: 'Bruxelles-Ville', nameNl: 'Stad Brussel', postalCode: '1000', landmarkFr: 'la Grand-Place', landmarkNl: 'de Grote Markt' },
  { slugFr: 'anderlecht', slugNl: 'anderlecht', nameFr: 'Anderlecht', nameNl: 'Anderlecht', postalCode: '1070', landmarkFr: 'le stade Lotto Park', landmarkNl: 'het Lotto Park-stadion' },
  { slugFr: 'auderghem', slugNl: 'oudergem', nameFr: 'Auderghem', nameNl: 'Oudergem', postalCode: '1160', landmarkFr: 'la forêt de Soignes', landmarkNl: 'het Zoniënwoud' },
  { slugFr: 'berchem-sainte-agathe', slugNl: 'sint-agatha-berchem', nameFr: 'Berchem-Sainte-Agathe', nameNl: 'Sint-Agatha-Berchem', postalCode: '1082', landmarkFr: 'le parc Roi Baudouin', landmarkNl: 'het Koning Boudewijnpark' },
  { slugFr: 'etterbeek', slugNl: 'etterbeek', nameFr: 'Etterbeek', nameNl: 'Etterbeek', postalCode: '1040', landmarkFr: 'le parc du Cinquantenaire', landmarkNl: 'het Jubelpark' },
  { slugFr: 'evere', slugNl: 'evere', nameFr: 'Evere', nameNl: 'Evere', postalCode: '1140', landmarkFr: 'le cimetière de Bruxelles', landmarkNl: 'de Brusselse begraafplaats' },
  { slugFr: 'forest', slugNl: 'vorst', nameFr: 'Forest', nameNl: 'Vorst', postalCode: '1190', landmarkFr: 'le parc Duden', landmarkNl: 'het Dudenpark' },
  { slugFr: 'ganshoren', slugNl: 'ganshoren', nameFr: 'Ganshoren', nameNl: 'Ganshoren', postalCode: '1083', landmarkFr: 'le parc Sobieski', landmarkNl: 'het Sobieskipark' },
  { slugFr: 'ixelles', slugNl: 'elsene', nameFr: 'Ixelles', nameNl: 'Elsene', postalCode: '1050', landmarkFr: 'les étangs d’Ixelles', landmarkNl: 'de Vijvers van Elsene' },
  { slugFr: 'jette', slugNl: 'jette', nameFr: 'Jette', nameNl: 'Jette', postalCode: '1090', landmarkFr: 'le cimetière de Jette', landmarkNl: 'de Begraafplaats van Jette' },
  { slugFr: 'koekelberg', slugNl: 'koekelberg', nameFr: 'Koekelberg', nameNl: 'Koekelberg', postalCode: '1081', landmarkFr: 'la basilique de Koekelberg', landmarkNl: 'de Basiliek van Koekelberg' },
  { slugFr: 'molenbeek-saint-jean', slugNl: 'sint-jans-molenbeek', nameFr: 'Molenbeek-Saint-Jean', nameNl: 'Sint-Jans-Molenbeek', postalCode: '1080', landmarkFr: 'le canal de Bruxelles', landmarkNl: 'het Brussels kanaal' },
  { slugFr: 'saint-gilles', slugNl: 'sint-gillis', nameFr: 'Saint-Gilles', nameNl: 'Sint-Gillis', postalCode: '1060', landmarkFr: 'le parvis de Saint-Gilles', landmarkNl: 'het Sint-Gillisvoorplein' },
  { slugFr: 'saint-josse-ten-noode', slugNl: 'sint-joost-ten-node', nameFr: 'Saint-Josse-ten-Noode', nameNl: 'Sint-Joost-ten-Node', postalCode: '1210', landmarkFr: 'le Jardin botanique', landmarkNl: 'de Kruidtuin' },
  { slugFr: 'schaerbeek', slugNl: 'schaarbeek', nameFr: 'Schaerbeek', nameNl: 'Schaarbeek', postalCode: '1030', landmarkFr: 'le parc Josaphat', landmarkNl: 'het Josaphatpark' },
  { slugFr: 'uccle', slugNl: 'ukkel', nameFr: 'Uccle', nameNl: 'Ukkel', postalCode: '1180', landmarkFr: 'le bois de la Cambre', landmarkNl: 'het Ter Kamerenbos' },
  { slugFr: 'watermael-boitsfort', slugNl: 'watermaal-bosvoorde', nameFr: 'Watermael-Boitsfort', nameNl: 'Watermaal-Bosvoorde', postalCode: '1170', landmarkFr: 'l’hippodrome de Boitsfort', landmarkNl: 'de Hippodroom van Bosvoorde' },
  { slugFr: 'woluwe-saint-lambert', slugNl: 'sint-lambrechts-woluwe', nameFr: 'Woluwe-Saint-Lambert', nameNl: 'Sint-Lambrechts-Woluwe', postalCode: '1200', landmarkFr: 'le parc de Woluwe', landmarkNl: 'het Woluwepark' },
  { slugFr: 'woluwe-saint-pierre', slugNl: 'sint-pieters-woluwe', nameFr: 'Woluwe-Saint-Pierre', nameNl: 'Sint-Pieters-Woluwe', postalCode: '1150', landmarkFr: 'le château Malou', landmarkNl: 'het Kasteel Malou' },
];

export function findCommune(slug: string, locale: 'fr' | 'nl'): CommuneInfo | null {
  return COMMUNES.find((c) => (locale === 'nl' ? c.slugNl : c.slugFr) === slug) ?? null;
}
