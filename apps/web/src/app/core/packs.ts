import { CategoryKey, SiteLocale } from './locale';

/**
 * Les trois formules vendues dans chaque catégorie, plus le sur mesure.
 * `photo` : prise de vue + retouche ; `video` : tournage + montage ;
 * `combo` : les deux, par la même personne, à un prix inférieur à la somme
 * des deux ; `custom` : sur devis, sans prix affiché.
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

const MARIAGE_PHOTO: Pack = {
  type: 'photo',
  price: 1290,
  duration: tr('Journée complète', 'Volledige dag', 'Full day'),
  deliverables: tr(
    'Environ 400 photos retouchées, galerie en ligne',
    'Ongeveer 400 bewerkte foto’s, online galerij',
    'Around 400 edited photos, online gallery',
  ),
  included: list(
    ['Repérage du lieu', 'Préparatifs, cérémonie, cocktail et soirée', 'Retouche de toutes les photos', 'Aperçu sous 7 jours'],
    ['Verkenning van de locatie', 'Voorbereidingen, ceremonie, receptie en feest', 'Bewerking van alle foto’s', 'Voorproefje binnen 7 dagen'],
    ['Venue scouting', 'Getting ready, ceremony, drinks and party', 'Every photo edited', 'Sneak peek within 7 days'],
  ),
};

const MARIAGE_VIDEO: Pack = {
  type: 'video',
  price: 1590,
  duration: tr('Journée complète', 'Volledige dag', 'Full day'),
  deliverables: tr(
    'Film de 5 à 8 min + teaser de 1 min',
    'Film van 5 tot 8 min + teaser van 1 min',
    '5 to 8 min film + 1 min teaser',
  ),
  included: list(
    ['Repérage du lieu', 'Captation cérémonie et soirée', 'Étalonnage', 'Musique sous licence', 'Deux allers-retours de montage'],
    ['Verkenning van de locatie', 'Opname ceremonie en feest', 'Kleurcorrectie', 'Muziek in licentie', 'Twee rondes feedback'],
    ['Venue scouting', 'Ceremony and party coverage', 'Colour grading', 'Licensed music', 'Two rounds of edits'],
  ),
};

const EVENEMENTIEL_PHOTO: Pack = {
  type: 'photo',
  price: 390,
  duration: tr('3 heures', '3 uur', '3 hours'),
  deliverables: tr(
    'Environ 150 photos retouchées, galerie en ligne',
    'Ongeveer 150 bewerkte foto’s, online galerij',
    'Around 150 edited photos, online gallery',
  ),
  included: list(
    ['Reportage discret', 'Retouche de toutes les photos', 'Livraison sous 3 semaines'],
    ['Discrete reportage', 'Bewerking van alle foto’s', 'Levering binnen 3 weken'],
    ['Unobtrusive coverage', 'Every photo edited', 'Delivered within 3 weeks'],
  ),
};

const EVENEMENTIEL_VIDEO: Pack = {
  type: 'video',
  price: 590,
  duration: tr('3 heures', '3 uur', '3 hours'),
  deliverables: tr(
    'Aftermovie de 2 à 3 min + 1 format vertical',
    'Aftermovie van 2 tot 3 min + 1 verticaal formaat',
    '2 to 3 min aftermovie + 1 vertical cut',
  ),
  included: list(
    ['Captation des temps forts', 'Étalonnage', 'Musique sous licence'],
    ['Opname van de hoogtepunten', 'Kleurcorrectie', 'Muziek in licentie'],
    ['Highlights coverage', 'Colour grading', 'Licensed music'],
  ),
};

const CORPORATE_PHOTO: Pack = {
  type: 'photo',
  price: 490,
  duration: tr('Demi-journée', 'Halve dag', 'Half day'),
  deliverables: tr(
    'Portraits d’équipe et photos des locaux, retouchés',
    'Teamportretten en foto’s van de bedrijfsruimte, bewerkt',
    'Team headshots and premises photos, edited',
  ),
  included: list(
    ['Portraits homogènes pour LinkedIn et site', 'Photos des locaux et de l’activité', 'Droits d’usage commercial'],
    ['Uniforme portretten voor LinkedIn en website', 'Foto’s van de bedrijfsruimte en de activiteit', 'Commerciële gebruiksrechten'],
    ['Consistent headshots for LinkedIn and website', 'Premises and activity photos', 'Commercial usage rights'],
  ),
};

const CORPORATE_VIDEO: Pack = {
  type: 'video',
  price: 990,
  duration: tr('Demi-journée', 'Halve dag', 'Half day'),
  deliverables: tr(
    'Film de 1 à 2 min + 3 formats réseaux sociaux',
    'Film van 1 tot 2 min + 3 formaten voor sociale media',
    '1 to 2 min film + 3 social media cuts',
  ),
  included: list(
    ['Script et interviews', 'Habillage graphique (logo, charte)', 'Sous-titres', 'Deux allers-retours de montage'],
    ['Script en interviews', 'Grafische opmaak (logo, huisstijl)', 'Ondertitels', 'Twee rondes feedback'],
    ['Script and interviews', 'Branding (logo, guidelines)', 'Subtitles', 'Two rounds of edits'],
  ),
};

const SPORT_PHOTO: Pack = {
  type: 'photo',
  price: 350,
  duration: tr('Un match ou une compétition', 'Eén wedstrijd of competitie', 'One match or competition'),
  deliverables: tr(
    'Environ 100 photos retouchées',
    'Ongeveer 100 bewerkte foto’s',
    'Around 100 edited photos',
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
    'Résumé vidéo de 1 à 2 min + 1 format vertical',
    'Videosamenvatting van 1 tot 2 min + 1 verticaal formaat',
    '1 to 2 min highlights + 1 vertical cut',
  ),
  included: list(
    ['Captation multi-focale', 'Ralentis sur les temps forts', 'Sound design'],
    ['Opname met meerdere brandpunten', 'Slow motion op de hoogtepunten', 'Sound design'],
    ['Multi-lens coverage', 'Slow motion on key moments', 'Sound design'],
  ),
};

const CLIP_PHOTO: Pack = {
  type: 'photo',
  price: 290,
  duration: tr('Séance de 2 heures', 'Sessie van 2 uur', '2-hour session'),
  deliverables: tr(
    '15 photos retouchées (promo, pochette, presse)',
    '15 bewerkte foto’s (promo, hoes, pers)',
    '15 edited photos (promo, cover art, press)',
  ),
  included: list(
    ['Direction artistique', 'Retouche soignée', 'Formats réseaux et presse'],
    ['Artistieke leiding', 'Zorgvuldige bewerking', 'Formaten voor sociale media en pers'],
    ['Art direction', 'Careful retouching', 'Social and press formats'],
  ),
};

const CLIP_VIDEO: Pack = {
  type: 'video',
  price: 890,
  duration: tr('1 jour de tournage', '1 opnamedag', '1 shooting day'),
  deliverables: tr(
    'Clip jusqu’à 4 min, étalonné + déclinaisons courtes',
    'Clip tot 4 min, met kleurcorrectie + korte versies',
    'Music video up to 4 min, graded + short cuts',
  ),
  included: list(
    ['Direction artistique et repérage', 'Montage rythmique sur le morceau', 'Étalonnage', 'Deux allers-retours de montage'],
    ['Artistieke leiding en verkenning', 'Ritmische montage op het nummer', 'Kleurcorrectie', 'Twee rondes feedback'],
    ['Art direction and scouting', 'Rhythmic edit on the track', 'Colour grading', 'Two rounds of edits'],
  ),
};

const LIFESTYLE_PHOTO: Pack = {
  type: 'photo',
  price: 250,
  duration: tr('1 h 30', '1 u 30', '1.5 hours'),
  deliverables: tr(
    '25 photos retouchées, galerie en ligne',
    '25 bewerkte foto’s, online galerij',
    '25 edited photos, online gallery',
  ),
  included: list(
    ['Couple, famille, grossesse ou portrait', 'Choix du lieu ensemble', 'Livraison sous 2 semaines'],
    ['Koppel, gezin, zwangerschap of portret', 'Locatie samen gekozen', 'Levering binnen 2 weken'],
    ['Couple, family, maternity or portrait', 'Location chosen together', 'Delivered within 2 weeks'],
  ),
};

const LIFESTYLE_VIDEO: Pack = {
  type: 'video',
  price: 450,
  duration: tr('Demi-journée', 'Halve dag', 'Half day'),
  deliverables: tr(
    '2 reels de 30 à 60 s, prêts à publier',
    '2 reels van 30 tot 60 s, klaar om te posten',
    '2 reels of 30 to 60 s, ready to post',
  ),
  included: list(
    ['Tournage naturel, sans script', 'Montage rythmé pour Instagram et TikTok', 'Musique sous licence'],
    ['Natuurlijke opname, zonder script', 'Ritmische montage voor Instagram en TikTok', 'Muziek in licentie'],
    ['Natural, unscripted shoot', 'Punchy edit for Instagram and TikTok', 'Licensed music'],
  ),
};

function combo(price: number, photo: Pack, video: Pack, duration: Pack['duration']): Pack {
  return {
    type: 'combo',
    price,
    duration,
    deliverables: both(photo, video),
    included: list(
      ['Une seule personne pour la photo et la vidéo', 'Un seul style, un seul interlocuteur', ...photo.included.fr.slice(0, 2), ...video.included.fr.slice(0, 2)],
      ['Eén persoon voor foto en video', 'Eén stijl, één aanspreekpunt', ...photo.included.nl.slice(0, 2), ...video.included.nl.slice(0, 2)],
      ['One person for both photo and video', 'One style, one point of contact', ...photo.included.en.slice(0, 2), ...video.included.en.slice(0, 2)],
    ),
  };
}

/**
 * Grille tarifaire complète, une entrée par catégorie. Prix validés par le
 * client (septembre 2026) ; les durées et livrables reprennent ceux de la
 * grille validée. Un dictionnaire statique plutôt qu'une table en base, par
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
      combo(2690, MARIAGE_PHOTO, MARIAGE_VIDEO, tr('Journée complète', 'Volledige dag', 'Full day')),
      CUSTOM,
    ],
  },
  {
    key: 'evenementiel',
    vat: 'ttc',
    packs: [
      EVENEMENTIEL_PHOTO,
      EVENEMENTIEL_VIDEO,
      combo(890, EVENEMENTIEL_PHOTO, EVENEMENTIEL_VIDEO, tr('3 heures', '3 uur', '3 hours')),
      CUSTOM,
    ],
  },
  {
    key: 'corporate',
    vat: 'htva',
    packs: [
      CORPORATE_PHOTO,
      CORPORATE_VIDEO,
      combo(1390, CORPORATE_PHOTO, CORPORATE_VIDEO, tr('Demi-journée', 'Halve dag', 'Half day')),
      CUSTOM,
    ],
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
    packs: [
      CLIP_PHOTO,
      CLIP_VIDEO,
      combo(1090, CLIP_PHOTO, CLIP_VIDEO, tr('1 jour de tournage', '1 opnamedag', '1 shooting day')),
      CUSTOM,
    ],
  },
  {
    key: 'lifestyle',
    vat: 'ttc',
    packs: [
      LIFESTYLE_PHOTO,
      LIFESTYLE_VIDEO,
      combo(640, LIFESTYLE_PHOTO, LIFESTYLE_VIDEO, tr('Demi-journée', 'Halve dag', 'Half day')),
      CUSTOM,
    ],
  },
];

export function pricingFor(key: CategoryKey): CategoryPricing {
  const entry = PRICING.find((p) => p.key === key);
  if (!entry) {
    throw new Error(`Aucune grille tarifaire pour la catégorie « ${key} ».`);
  }
  return entry;
}

/** Prix d'appel d'une catégorie : le pack le moins cher (toujours le pack photo). */
export function startingPrice(key: CategoryKey): number {
  return Math.min(...pricingFor(key).packs.flatMap((p) => (p.price === null ? [] : [p.price])));
}

/** Économie du combo par rapport aux packs photo et vidéo séparés, en euros. */
export function comboSaving(pricing: CategoryPricing): number {
  const price = (type: PackType) => pricing.packs.find((p) => p.type === type)?.price ?? 0;
  return price('photo') + price('video') - price('combo');
}

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
