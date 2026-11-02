import { CategoryKey, SiteLocale } from './locale';

/**
 * Les formules vendues dans une catégorie. `photo` : prise de vue +
 * retouche ; `video` : tournage + montage ; `combo` : les deux, par la même
 * personne, à un prix inférieur à la somme des deux ; `custom` : sur devis,
 * sans prix affiché. Les catégories à prix affiché proposent les quatre ;
 * corporate, clip et lifestyle ne proposent que le sur mesure (décision
 * client, octobre 2026 : ces demandes varient trop pour un prix fixe).
 */
export type PackType = 'photo' | 'video' | 'combo' | 'custom';

export const PACK_TYPES: readonly PackType[] = ['photo', 'video', 'combo', 'custom'];

/**
 * Régime de TVA affiché à côté du prix. `ttc` pour les catégories vendues à
 * des particuliers (mariage, événementiel, lifestyle), `htva` pour celles
 * vendues à des professionnels (corporate, sport, clip) — décision client.
 */
export type VatMode = 'ttc' | 'htva';

export interface Pack {
  readonly type: PackType;
  /** Prix en euros, entier ; `null` pour le sur mesure. */
  readonly price: number | null;
  /** Durée de la prestation, par langue ("Journée complète"). */
  readonly duration: Readonly<Record<SiteLocale, string>>;
  /** Ce que le client reçoit, par langue ("~400 photos, galerie en ligne"). */
  readonly deliverables: Readonly<Record<SiteLocale, string>>;
  /** Éléments inclus, par langue. */
  readonly included: Readonly<Record<SiteLocale, readonly string[]>>;
}

export interface CategoryPricing {
  readonly key: CategoryKey;
  readonly vat: VatMode;
  readonly packs: readonly Pack[];
}

const tr = (fr: string, nl: string, en: string): Readonly<Record<SiteLocale, string>> => ({ fr, nl, en });
const list = (
  fr: readonly string[],
  nl: readonly string[],
  en: readonly string[],
): Readonly<Record<SiteLocale, readonly string[]>> => ({ fr, nl, en });

/** Livrable du pack combo : les livrables photo et vidéo, réunis en une phrase. */
const both = (photo: Pack, video: Pack): Readonly<Record<SiteLocale, string>> => ({
  fr: `${photo.deliverables.fr} + ${video.deliverables.fr}`,
  nl: `${photo.deliverables.nl} + ${video.deliverables.nl}`,
  en: `${photo.deliverables.en} + ${video.deliverables.en}`,
});

const CUSTOM: Pack = {
  type: 'custom',
  price: null,
  duration: tr('Selon le projet', 'Volgens het project', 'Depends on the project'),
  deliverables: tr(
    'Prestation construite avec vous : durée, livrables, options',
    'Samen met u opgebouwd: duur, eindproducten, opties',
    'Built with you: duration, deliverables, options',
  ),
  included: list(
    ['Échange préalable', 'Devis chiffré sous 48 h', 'Toutes les options à la carte'],
    ['Voorafgaand gesprek', 'Concrete offerte binnen 48 u', 'Alle opties à la carte'],
    ['Preliminary call', 'Itemised quote within 48 h', 'Every option à la carte'],
  ),
};

const MARIAGE_DELIVERY = tr('Livraison sous 2 à 4 semaines', 'Levering binnen 2 tot 4 weken', 'Delivered within 2 to 4 weeks');
const EVENEMENTIEL_PHOTO_DELIVERY = tr('Livraison dans la semaine', 'Levering binnen de week', 'Delivered within a week');
const EVENEMENTIEL_VIDEO_DELIVERY = tr('Livraison sous 1 à 2 semaines', 'Levering binnen 1 tot 2 weken', 'Delivered within 1 to 2 weeks');
const EVENEMENTIEL_DURATION = tr('3 heures sur place', '3 uur ter plaatse', '3 hours on site');

const MARIAGE_PHOTO: Pack = {
  type: 'photo',
  price: 1290,
  duration: tr('Journée complète', 'Volledige dag', 'Full day'),
  deliverables: tr(
    'Environ 300 photos retouchées, galerie en ligne',
    'Ongeveer 300 bewerkte foto’s, online galerij',
    'Around 300 edited photos, online gallery',
  ),
  included: list(
    ['Repérage du lieu', 'Préparatifs, cérémonie, cocktail et soirée', 'Retouche de toutes les photos', MARIAGE_DELIVERY.fr],
    ['Verkenning van de locatie', 'Voorbereidingen, ceremonie, receptie en feest', 'Bewerking van alle foto’s', MARIAGE_DELIVERY.nl],
    ['Venue scouting', 'Getting ready, ceremony, drinks and party', 'Every photo edited', MARIAGE_DELIVERY.en],
  ),
};

const MARIAGE_VIDEO: Pack = {
  type: 'video',
  price: 1590,
  duration: tr('Journée complète', 'Volledige dag', 'Full day'),
  deliverables: tr(
    'Film de 7 à 10 min',
    'Film van 7 tot 10 min',
    '7 to 10 min film',
  ),
  included: list(
    ['Repérage du lieu', 'Captation cérémonie et soirée', 'Étalonnage', 'Deux allers-retours de montage', MARIAGE_DELIVERY.fr],
    ['Verkenning van de locatie', 'Opname ceremonie en feest', 'Kleurcorrectie', 'Twee rondes feedback', MARIAGE_DELIVERY.nl],
    ['Venue scouting', 'Ceremony and party coverage', 'Colour grading', 'Two rounds of edits', MARIAGE_DELIVERY.en],
  ),
};

const EVENEMENTIEL_PHOTO: Pack = {
  type: 'photo',
  price: 300,
  duration: EVENEMENTIEL_DURATION,
  deliverables: tr(
    'Environ 100 photos retouchées, galerie en ligne',
    'Ongeveer 100 bewerkte foto’s, online galerij',
    'Around 100 edited photos, online gallery',
  ),
  included: list(
    ['Reportage discret', 'Retouche de toutes les photos', EVENEMENTIEL_PHOTO_DELIVERY.fr],
    ['Discrete reportage', 'Bewerking van alle foto’s', EVENEMENTIEL_PHOTO_DELIVERY.nl],
    ['Unobtrusive coverage', 'Every photo edited', EVENEMENTIEL_PHOTO_DELIVERY.en],
  ),
};

const EVENEMENTIEL_VIDEO: Pack = {
  type: 'video',
  price: 490,
  duration: EVENEMENTIEL_DURATION,
  deliverables: tr(
    '1 aftermovie de 30 s à 1 min',
    '1 aftermovie van 30 s tot 1 min',
    '1 aftermovie of 30 s to 1 min',
  ),
  included: list(
    ['Captation des temps forts', 'Étalonnage', 'Musique sous licence', EVENEMENTIEL_VIDEO_DELIVERY.fr],
    ['Opname van de hoogtepunten', 'Kleurcorrectie', 'Muziek in licentie', EVENEMENTIEL_VIDEO_DELIVERY.nl],
    ['Highlights coverage', 'Colour grading', 'Licensed music', EVENEMENTIEL_VIDEO_DELIVERY.en],
  ),
};

const SPORT_PHOTO: Pack = {
  type: 'photo',
  price: 350,
  duration: tr('Un match ou une compétition', 'Eén wedstrijd of competitie', 'One match or competition'),
  deliverables: tr(
    'Environ 70 photos retouchées',
    'Ongeveer 70 bewerkte foto’s',
    'Around 70 edited photos',
  ),
  included: list(
    ['Action et coulisses', 'Sélection prête pour les réseaux', 'Droits d’usage pour le club'],
    ['Actie en backstage', 'Selectie klaar voor sociale media', 'Gebruiksrechten voor de club'],
    ['Action and behind the scenes', 'Social-ready selection', 'Usage rights for the club'],
  ),
};

const SPORT_VIDEO: Pack = {
  type: 'video',
  price: 590,
  duration: tr('Un match ou une compétition', 'Eén wedstrijd of competitie', 'One match or competition'),
  deliverables: tr(
    'Résumé vidéo de 1 à 2 min',
    'Videosamenvatting van 1 tot 2 min',
    '1 to 2 min highlights video',
  ),
  included: list(
    ['Captation multi-focale', 'Ralentis sur les temps forts', 'Sound design'],
    ['Opname met meerdere brandpunten', 'Slow motion op de hoogtepunten', 'Sound design'],
    ['Multi-lens coverage', 'Slow motion on key moments', 'Sound design'],
  ),
};

/**
 * Pack combo : deux arguments propres au combo, les deux premiers inclus de
 * chaque pack (sans doublon, le repérage est commun) et, s'il est donné, le
 * délai de livraison.
 */
function combo(
  price: number,
  photo: Pack,
  video: Pack,
  duration: Pack['duration'],
  delivery?: Readonly<Record<SiteLocale, string>>,
): Pack {
  const included = (locale: SiteLocale, intro: readonly string[]): readonly string[] => [
    ...new Set([
      ...intro,
      ...photo.included[locale].slice(0, 2),
      ...video.included[locale].slice(0, 2),
      ...(delivery ? [delivery[locale]] : []),
    ]),
  ];
  return {
    type: 'combo',
    price,
    duration,
    deliverables: both(photo, video),
    included: list(
      included('fr', ['Une seule personne pour la photo et la vidéo', 'Un seul style, un seul interlocuteur']),
      included('nl', ['Eén persoon voor foto en video', 'Eén stijl, één aanspreekpunt']),
      included('en', ['One person for both photo and video', 'One style, one point of contact']),
    ),
  };
}

/**
 * Grille tarifaire complète, une entrée par catégorie. Prix validés par le
 * client (septembre 2026, révisés en octobre 2026 : mariage, événementiel et
 * sport ajustés, corporate, clip et lifestyle sur devis seulement) ; les
 * durées et livrables reprennent ceux de la grille validée. Un dictionnaire statique plutôt qu'une table en base, par
 * cohérence avec la décision déjà prise pour `SITE_CONTENT` : ces prix
 * changent une fois par an, un changement de code + déploiement suffit, et
 * le site les affiche sans aller-retour API.
 */
export const PRICING: readonly CategoryPricing[] = [
  {
    key: 'mariage',
    vat: 'ttc',
    packs: [
      MARIAGE_PHOTO,
      MARIAGE_VIDEO,
      combo(2790, MARIAGE_PHOTO, MARIAGE_VIDEO, tr('Journée complète', 'Volledige dag', 'Full day'), MARIAGE_DELIVERY),
      CUSTOM,
    ],
  },
  {
    key: 'evenementiel',
    vat: 'ttc',
    packs: [
      EVENEMENTIEL_PHOTO,
      EVENEMENTIEL_VIDEO,
      combo(700, EVENEMENTIEL_PHOTO, EVENEMENTIEL_VIDEO, EVENEMENTIEL_DURATION, EVENEMENTIEL_VIDEO_DELIVERY),
      CUSTOM,
    ],
  },
  {
    key: 'corporate',
    vat: 'htva',
    packs: [CUSTOM],
  },
  {
    key: 'sport',
    vat: 'htva',
    packs: [
      SPORT_PHOTO,
      SPORT_VIDEO,
      combo(850, SPORT_PHOTO, SPORT_VIDEO, tr('Un match ou une compétition', 'Eén wedstrijd of competitie', 'One match or competition')),
      CUSTOM,
    ],
  },
  {
    key: 'clip',
    vat: 'htva',
    packs: [CUSTOM],
  },
  {
    key: 'lifestyle',
    vat: 'ttc',
    packs: [CUSTOM],
  },
];

export function pricingFor(key: CategoryKey): CategoryPricing {
  const entry = PRICING.find((p) => p.key === key);
  if (!entry) {
    throw new Error(`Aucune grille tarifaire pour la catégorie « ${key} ».`);
  }
  return entry;
}

/**
 * Prix d'appel d'une catégorie : le pack le moins cher (toujours le pack
 * photo), ou `null` pour une catégorie vendue uniquement sur devis.
 */
export function startingPrice(key: CategoryKey): number | null {
  const prices = pricingFor(key).packs.flatMap((p) => (p.price === null ? [] : [p.price]));
  return prices.length ? Math.min(...prices) : null;
}

/** Prix d'appel du site : le pack le moins cher, toutes catégories confondues. */
export function lowestPrice(): number {
  return Math.min(...PRICING.flatMap((p) => p.packs.flatMap((pack) => (pack.price === null ? [] : [pack.price]))));
}

/** Économie du combo par rapport aux packs photo et vidéo séparés, en euros. */
export function comboSaving(pricing: CategoryPricing): number {
  const price = (type: PackType) => pricing.packs.find((p) => p.type === type)?.price ?? 0;
  return price('photo') + price('video') - price('combo');
}

/**
 * Prix d'appel en clair, avec sa TVA : « à partir de 1 290 € TTC », ou
 * « Sur devis » pour une catégorie sans prix affiché.
 */
export function startingPriceText(key: CategoryKey, locale: SiteLocale): string {
  const price = startingPrice(key);
  if (price === null) {
    return ON_QUOTE[locale];
  }
  return `${FROM[locale]} ${formatPrice(price)} ${VAT_LABELS[pricingFor(key).vat][locale]}`;
}

const FROM = tr('à partir de', 'vanaf', 'from');
const ON_QUOTE = tr('Sur devis', 'Op offerte', 'On quote');

/** Libellés de chaque type de pack, par langue. */
export const PACK_LABELS: Readonly<Record<PackType, Readonly<Record<SiteLocale, string>>>> = {
  photo: tr('Photo + retouche', 'Foto + bewerking', 'Photo + editing'),
  video: tr('Vidéo + montage', 'Video + montage', 'Video + editing'),
  combo: tr('Photo + vidéo', 'Foto + video', 'Photo + video'),
  custom: tr('Sur mesure', 'Op maat', 'Custom'),
};

/** Mention de TVA affichée à côté du prix. */
export const VAT_LABELS: Readonly<Record<VatMode, Readonly<Record<SiteLocale, string>>>> = {
  ttc: tr('TTC', 'incl. btw', 'incl. VAT'),
  htva: tr('HTVA', 'excl. btw', 'excl. VAT'),
};

/** "1 290 €" — espace insécable comme séparateur de milliers, symbole après. */
export function formatPrice(amount: number): string {
  // `fr-BE` groupe les milliers avec une espace fine insécable (U+202F) ou
  // une espace insécable selon le moteur : on normalise sur U+00A0, que
  // tous les navigateurs affichent sans casser la ligne.
  const grouped = amount.toLocaleString('fr-BE').replace(/[\u202f\u00a0 ]/g, '\u00a0');
  return `${grouped}\u00a0€`;
}
