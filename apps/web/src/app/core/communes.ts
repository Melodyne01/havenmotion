export interface CommuneInfo {
  readonly slugFr: string;
  readonly slugNl: string;
  readonly nameFr: string;
  readonly nameNl: string;
  readonly postalCode: string;
  readonly landmarkFr: string | null;
  readonly landmarkNl: string | null;
  /**
   * true pour les 19 communes de la Région de Bruxelles-Capitale, false pour
   * les communes de la périphérie flamande (Brabant flamand) autour de
   * Wemmel. La distinction compte pour le texte des pages : "comme dans
   * chacune des communes bruxelloises" serait une erreur administrative pour
   * Wemmel, Grimbergen, Meise, Asse, Dilbeek ou Vilvoorde — ce ne sont pas
   * des communes de la Région de Bruxelles-Capitale.
   */
  readonly isBrusselsRegion: boolean;
}

/**
 * Zone d'intervention du studio : les 19 communes de la Région de
 * Bruxelles-Capitale, plus Wemmel (commune d'origine du client) et ses
 * voisines directes en périphérie flamande. Liste administrative fixe,
 * d'où un dictionnaire statique plutôt qu'une entité en base — rien à
 * gérer depuis le backoffice, aucun aller-retour API pour construire ces
 * pages ou le lien FR/NL équivalent.
 */
export const COMMUNES: readonly CommuneInfo[] = [
  // --- Région de Bruxelles-Capitale (19) ---
  { slugFr: 'bruxelles-ville', slugNl: 'stad-brussel', nameFr: 'Bruxelles-Ville', nameNl: 'Stad Brussel', postalCode: '1000', landmarkFr: 'la Grand-Place', landmarkNl: 'de Grote Markt', isBrusselsRegion: true },
  { slugFr: 'anderlecht', slugNl: 'anderlecht', nameFr: 'Anderlecht', nameNl: 'Anderlecht', postalCode: '1070', landmarkFr: 'le stade Lotto Park', landmarkNl: 'het Lotto Park-stadion', isBrusselsRegion: true },
  { slugFr: 'auderghem', slugNl: 'oudergem', nameFr: 'Auderghem', nameNl: 'Oudergem', postalCode: '1160', landmarkFr: 'la forêt de Soignes', landmarkNl: 'het Zoniënwoud', isBrusselsRegion: true },
  { slugFr: 'berchem-sainte-agathe', slugNl: 'sint-agatha-berchem', nameFr: 'Berchem-Sainte-Agathe', nameNl: 'Sint-Agatha-Berchem', postalCode: '1082', landmarkFr: 'le parc Roi Baudouin', landmarkNl: 'het Koning Boudewijnpark', isBrusselsRegion: true },
  { slugFr: 'etterbeek', slugNl: 'etterbeek', nameFr: 'Etterbeek', nameNl: 'Etterbeek', postalCode: '1040', landmarkFr: 'le parc du Cinquantenaire', landmarkNl: 'het Jubelpark', isBrusselsRegion: true },
  { slugFr: 'evere', slugNl: 'evere', nameFr: 'Evere', nameNl: 'Evere', postalCode: '1140', landmarkFr: 'le cimetière de Bruxelles', landmarkNl: 'de Brusselse begraafplaats', isBrusselsRegion: true },
  { slugFr: 'forest', slugNl: 'vorst', nameFr: 'Forest', nameNl: 'Vorst', postalCode: '1190', landmarkFr: 'le parc Duden', landmarkNl: 'het Dudenpark', isBrusselsRegion: true },
  { slugFr: 'ganshoren', slugNl: 'ganshoren', nameFr: 'Ganshoren', nameNl: 'Ganshoren', postalCode: '1083', landmarkFr: 'le parc Sobieski', landmarkNl: 'het Sobieskipark', isBrusselsRegion: true },
  { slugFr: 'ixelles', slugNl: 'elsene', nameFr: 'Ixelles', nameNl: 'Elsene', postalCode: '1050', landmarkFr: 'les étangs d’Ixelles', landmarkNl: 'de Vijvers van Elsene', isBrusselsRegion: true },
  { slugFr: 'jette', slugNl: 'jette', nameFr: 'Jette', nameNl: 'Jette', postalCode: '1090', landmarkFr: 'le cimetière de Jette', landmarkNl: 'de Begraafplaats van Jette', isBrusselsRegion: true },
  { slugFr: 'koekelberg', slugNl: 'koekelberg', nameFr: 'Koekelberg', nameNl: 'Koekelberg', postalCode: '1081', landmarkFr: 'la basilique de Koekelberg', landmarkNl: 'de Basiliek van Koekelberg', isBrusselsRegion: true },
  { slugFr: 'molenbeek-saint-jean', slugNl: 'sint-jans-molenbeek', nameFr: 'Molenbeek-Saint-Jean', nameNl: 'Sint-Jans-Molenbeek', postalCode: '1080', landmarkFr: 'le canal de Bruxelles', landmarkNl: 'het Brussels kanaal', isBrusselsRegion: true },
  { slugFr: 'saint-gilles', slugNl: 'sint-gillis', nameFr: 'Saint-Gilles', nameNl: 'Sint-Gillis', postalCode: '1060', landmarkFr: 'le parvis de Saint-Gilles', landmarkNl: 'het Sint-Gillisvoorplein', isBrusselsRegion: true },
  { slugFr: 'saint-josse-ten-noode', slugNl: 'sint-joost-ten-node', nameFr: 'Saint-Josse-ten-Noode', nameNl: 'Sint-Joost-ten-Node', postalCode: '1210', landmarkFr: 'le Jardin botanique', landmarkNl: 'de Kruidtuin', isBrusselsRegion: true },
  { slugFr: 'schaerbeek', slugNl: 'schaarbeek', nameFr: 'Schaerbeek', nameNl: 'Schaarbeek', postalCode: '1030', landmarkFr: 'le parc Josaphat', landmarkNl: 'het Josaphatpark', isBrusselsRegion: true },
  { slugFr: 'uccle', slugNl: 'ukkel', nameFr: 'Uccle', nameNl: 'Ukkel', postalCode: '1180', landmarkFr: 'le bois de la Cambre', landmarkNl: 'het Ter Kamerenbos', isBrusselsRegion: true },
  { slugFr: 'watermael-boitsfort', slugNl: 'watermaal-bosvoorde', nameFr: 'Watermael-Boitsfort', nameNl: 'Watermaal-Bosvoorde', postalCode: '1170', landmarkFr: 'l’hippodrome de Boitsfort', landmarkNl: 'de Hippodroom van Bosvoorde', isBrusselsRegion: true },
  { slugFr: 'woluwe-saint-lambert', slugNl: 'sint-lambrechts-woluwe', nameFr: 'Woluwe-Saint-Lambert', nameNl: 'Sint-Lambrechts-Woluwe', postalCode: '1200', landmarkFr: 'le parc de Woluwe', landmarkNl: 'het Woluwepark', isBrusselsRegion: true },
  { slugFr: 'woluwe-saint-pierre', slugNl: 'sint-pieters-woluwe', nameFr: 'Woluwe-Saint-Pierre', nameNl: 'Sint-Pieters-Woluwe', postalCode: '1150', landmarkFr: 'le château Malou', landmarkNl: 'het Kasteel Malou', isBrusselsRegion: true },

  // --- Périphérie flamande, autour de Wemmel (Brabant flamand) ---
  { slugFr: 'wemmel', slugNl: 'wemmel', nameFr: 'Wemmel', nameNl: 'Wemmel', postalCode: '1780', landmarkFr: 'la frontière avec la Région de Bruxelles-Capitale', landmarkNl: 'de grens met het Brussels Hoofdstedelijk Gewest', isBrusselsRegion: false },
  { slugFr: 'grimbergen', slugNl: 'grimbergen', nameFr: 'Grimbergen', nameNl: 'Grimbergen', postalCode: '1850', landmarkFr: 'la basilique de Grimbergen', landmarkNl: 'de Basiliek van Grimbergen', isBrusselsRegion: false },
  { slugFr: 'meise', slugNl: 'meise', nameFr: 'Meise', nameNl: 'Meise', postalCode: '1861', landmarkFr: 'le Jardin botanique de Meise', landmarkNl: 'de Plantentuin Meise', isBrusselsRegion: false },
  { slugFr: 'asse', slugNl: 'asse', nameFr: 'Asse', nameNl: 'Asse', postalCode: '1730', landmarkFr: null, landmarkNl: null, isBrusselsRegion: false },
  { slugFr: 'dilbeek', slugNl: 'dilbeek', nameFr: 'Dilbeek', nameNl: 'Dilbeek', postalCode: '1700', landmarkFr: null, landmarkNl: null, isBrusselsRegion: false },
  { slugFr: 'vilvorde', slugNl: 'vilvoorde', nameFr: 'Vilvorde', nameNl: 'Vilvoorde', postalCode: '1800', landmarkFr: null, landmarkNl: null, isBrusselsRegion: false },
];

export const BRUSSELS_COMMUNES: readonly CommuneInfo[] = COMMUNES.filter((c) => c.isBrusselsRegion);
export const PERIPHERY_COMMUNES: readonly CommuneInfo[] = COMMUNES.filter((c) => !c.isBrusselsRegion);

export function findCommune(slug: string, locale: 'fr' | 'nl'): CommuneInfo | null {
  return COMMUNES.find((c) => (locale === 'nl' ? c.slugNl : c.slugFr) === slug) ?? null;
}
