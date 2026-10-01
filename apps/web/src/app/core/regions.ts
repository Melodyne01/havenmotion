import { SiteLocale } from './locale';
import { TravelZoneId } from './travel-zones';

/**
 * Régions d'intervention, par pays. Chaque région porte sa zone de
 * déplacement (donc son forfait) et les langues dans lesquelles sa page
 * existera. Utilisée dès maintenant par le formulaire de devis (choix de la
 * région → forfait affiché) et le JSON-LD `areaServed` ; les pages région
 * elles-mêmes (`/zones/:pays/:region`) arrivent avec le chantier 5, sur
 * cette même liste. Un dictionnaire statique, comme `communes.ts` : une
 * liste administrative fixe n'a rien à faire en base.
 */
export type CountryCode = 'BE' | 'FR' | 'LU' | 'NL' | 'INT';

export interface Country {
  readonly code: CountryCode;
  readonly slug: Readonly<Record<SiteLocale, string>>;
  readonly name: Readonly<Record<SiteLocale, string>>;
}

export interface Region {
  readonly country: CountryCode;
  readonly slug: Readonly<Record<SiteLocale, string>>;
  readonly name: Readonly<Record<SiteLocale, string>>;
  readonly zone: TravelZoneId;
  /** Langues dans lesquelles la page région existe (voir la matrice du plan). */
  readonly languages: readonly SiteLocale[];
  /** Phase de déploiement du plan SEO (1, 2 ou 3). */
  readonly phase: 1 | 2 | 3;
}

const tr = (fr: string, nl: string, en: string): Readonly<Record<SiteLocale, string>> => ({ fr, nl, en });
const same = (v: string): Readonly<Record<SiteLocale, string>> => ({ fr: v, nl: v, en: v });

export const COUNTRIES: readonly Country[] = [
  { code: 'BE', slug: tr('belgique', 'belgie', 'belgium'), name: tr('Belgique', 'België', 'Belgium') },
  { code: 'FR', slug: tr('france', 'frankrijk', 'france'), name: tr('France', 'Frankrijk', 'France') },
  { code: 'LU', slug: tr('luxembourg', 'luxemburg', 'luxembourg'), name: tr('Luxembourg', 'Luxemburg', 'Luxembourg') },
  { code: 'NL', slug: tr('pays-bas', 'nederland', 'netherlands'), name: tr('Pays-Bas', 'Nederland', 'Netherlands') },
  { code: 'INT', slug: tr('international', 'internationaal', 'international'), name: tr('International', 'Internationaal', 'International') },
];

export const REGIONS: readonly Region[] = [
  // --- Belgique ---
  { country: 'BE', slug: tr('bruxelles', 'brussel', 'brussels'), name: tr('Bruxelles', 'Brussel', 'Brussels'), zone: 1, languages: ['fr', 'nl', 'en'], phase: 1 },
  { country: 'BE', slug: tr('brabant-flamand', 'vlaams-brabant', 'flemish-brabant'), name: tr('Brabant flamand', 'Vlaams-Brabant', 'Flemish Brabant'), zone: 1, languages: ['fr', 'nl'], phase: 1 },
  { country: 'BE', slug: tr('brabant-wallon', 'waals-brabant', 'walloon-brabant'), name: tr('Brabant wallon', 'Waals-Brabant', 'Walloon Brabant'), zone: 1, languages: ['fr', 'nl'], phase: 1 },
  { country: 'BE', slug: tr('anvers', 'antwerpen', 'antwerp'), name: tr('Anvers', 'Antwerpen', 'Antwerp'), zone: 1, languages: ['fr', 'nl', 'en'], phase: 2 },
  { country: 'BE', slug: tr('flandre-orientale', 'oost-vlaanderen', 'ghent-east-flanders'), name: tr('Flandre orientale', 'Oost-Vlaanderen', 'Ghent & East Flanders'), zone: 1, languages: ['fr', 'nl', 'en'], phase: 2 },
  { country: 'BE', slug: tr('flandre-occidentale', 'west-vlaanderen', 'bruges-west-flanders'), name: tr('Flandre occidentale', 'West-Vlaanderen', 'Bruges & West Flanders'), zone: 2, languages: ['fr', 'nl', 'en'], phase: 2 },
  { country: 'BE', slug: tr('limbourg', 'limburg', 'limburg'), name: tr('Limbourg', 'Limburg (België)', 'Limburg (Belgium)'), zone: 2, languages: ['fr', 'nl'], phase: 2 },
  { country: 'BE', slug: tr('hainaut', 'henegouwen', 'hainaut'), name: tr('Hainaut', 'Henegouwen', 'Hainaut'), zone: 2, languages: ['fr'], phase: 2 },
  { country: 'BE', slug: tr('namur', 'namen', 'namur'), name: tr('Namur', 'Namen', 'Namur'), zone: 2, languages: ['fr'], phase: 2 },
  { country: 'BE', slug: tr('liege', 'luik', 'liege'), name: tr('Liège', 'Luik', 'Liège'), zone: 2, languages: ['fr'], phase: 2 },
  { country: 'BE', slug: tr('ardennes', 'ardennen', 'ardennes'), name: tr('Ardennes', 'Ardennen', 'Ardennes'), zone: 2, languages: ['fr', 'nl', 'en'], phase: 2 },
  // --- France ---
  { country: 'FR', slug: tr('lille-nord', 'rijsel-nord', 'lille'), name: tr('Lille – Nord', 'Rijsel – Nord', 'Lille'), zone: 2, languages: ['fr', 'en'], phase: 1 },
  { country: 'FR', slug: tr('pas-de-calais-cote-d-opale', 'pas-de-calais-opaalkust', 'opal-coast'), name: tr('Pas-de-Calais – Côte d’Opale', 'Pas-de-Calais – Opaalkust', 'Pas-de-Calais – Opal Coast'), zone: 3, languages: ['fr'], phase: 2 },
  { country: 'FR', slug: tr('picardie-oise', 'picardie-oise', 'picardy-oise'), name: tr('Picardie – Oise', 'Picardië – Oise', 'Picardy – Oise'), zone: 3, languages: ['fr'], phase: 2 },
  { country: 'FR', slug: tr('champagne', 'champagne', 'champagne'), name: tr('Champagne – Reims', 'Champagne – Reims', 'Champagne – Reims'), zone: 3, languages: ['fr'], phase: 3 },
  { country: 'FR', slug: tr('paris-ile-de-france', 'parijs-ile-de-france', 'paris'), name: tr('Paris – Île-de-France', 'Parijs – Île-de-France', 'Paris'), zone: 4, languages: ['fr', 'en'], phase: 3 },
  // --- Luxembourg ---
  { country: 'LU', slug: same('luxembourg'), name: tr('Luxembourg', 'Luxemburg', 'Luxembourg'), zone: 3, languages: ['fr', 'nl', 'en'], phase: 1 },
  // --- Pays-Bas ---
  { country: 'NL', slug: tr('limbourg-neerlandais', 'nederlands-limburg', 'maastricht-limburg'), name: tr('Limbourg néerlandais (Maastricht)', 'Limburg (Nederland)', 'Maastricht & Limburg'), zone: 2, languages: ['nl', 'en'], phase: 2 },
  { country: 'NL', slug: tr('brabant-septentrional', 'noord-brabant', 'north-brabant'), name: tr('Brabant-Septentrional (Eindhoven, Breda)', 'Noord-Brabant', 'North Brabant'), zone: 2, languages: ['nl'], phase: 2 },
  { country: 'NL', slug: tr('zelande', 'zeeland', 'zeeland'), name: tr('Zélande', 'Zeeland', 'Zeeland'), zone: 2, languages: ['nl'], phase: 3 },
  { country: 'NL', slug: tr('hollande-meridionale', 'zuid-holland', 'south-holland'), name: tr('Hollande-Méridionale (Rotterdam, La Haye)', 'Zuid-Holland', 'South Holland'), zone: 3, languages: ['nl'], phase: 3 },
  { country: 'NL', slug: tr('utrecht', 'utrecht', 'utrecht'), name: same('Utrecht'), zone: 3, languages: ['nl'], phase: 3 },
  { country: 'NL', slug: tr('hollande-septentrionale', 'noord-holland', 'amsterdam'), name: tr('Hollande-Septentrionale (Amsterdam)', 'Noord-Holland', 'Amsterdam'), zone: 3, languages: ['nl', 'en'], phase: 3 },
  // --- International ---
  { country: 'INT', slug: tr('etranger', 'buitenland', 'destination'), name: tr('Ailleurs à l’étranger', 'Elders in het buitenland', 'Elsewhere abroad'), zone: 5, languages: ['fr', 'nl', 'en'], phase: 2 },
];

export function countryOf(code: CountryCode): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

export function regionsOf(code: CountryCode): readonly Region[] {
  return REGIONS.filter((r) => r.country === code);
}

/**
 * Identifiant stable d'une région pour le formulaire de devis et l'export
 * CSV : slug FR, lisible par le client dans le backoffice quelle que soit la
 * langue du formulaire d'origine.
 */
export function regionId(region: Region): string {
  return region.slug.fr;
}

export function findRegion(id: string): Region | null {
  return REGIONS.find((r) => r.slug.fr === id) ?? null;
}
