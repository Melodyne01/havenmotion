import { SiteLocale } from './locale';

/**
 * Forfaits de déplacement, par tranche de distance depuis Bruxelles / Wemmel.
 * Un forfait fixe par zone plutôt qu'un tarif au kilomètre : c'est ce que
 * le client a demandé, et c'est plus lisible pour un couple à Lille ou une
 * entreprise au Luxembourg que « 0,60 €/km, nous consulter ».
 */
export type TravelZoneId = 1 | 2 | 3 | 4 | 5;

export interface TravelZone {
  readonly id: TravelZoneId;
  /** Forfait en euros ; `null` = sur devis (zone 5). */
  readonly fee: number | null;
  /** Tranche de distance, par langue ("60 à 150 km"). */
  readonly distance: Readonly<Record<SiteLocale, string>>;
  /** Exemples de villes couvertes, par langue. */
  readonly examples: Readonly<Record<SiteLocale, string>>;
}

const tr = (fr: string, nl: string, en: string): Readonly<Record<SiteLocale, string>> => ({ fr, nl, en });

export const TRAVEL_ZONES: readonly TravelZone[] = [
  {
    id: 1,
    fee: 0,
    distance: tr('Jusqu’à 60 km', 'Tot 60 km', 'Up to 60 km'),
    examples: tr(
      'Bruxelles, Brabant flamand, Brabant wallon, Anvers, Malines, Gand, Alost',
      'Brussel, Vlaams-Brabant, Waals-Brabant, Antwerpen, Mechelen, Gent, Aalst',
      'Brussels, Flemish and Walloon Brabant, Antwerp, Mechelen, Ghent, Aalst',
    ),
  },
  {
    id: 2,
    fee: 90,
    distance: tr('60 à 150 km', '60 tot 150 km', '60 to 150 km'),
    examples: tr(
      'Liège, Namur, Mons, Bruges, Limbourg, Durbuy, Lille, Maastricht, Eindhoven, Breda, Zélande',
      'Luik, Namen, Bergen, Brugge, Limburg, Durbuy, Rijsel, Maastricht, Eindhoven, Breda, Zeeland',
      'Liège, Namur, Mons, Bruges, Limburg, Durbuy, Lille, Maastricht, Eindhoven, Breda, Zeeland',
    ),
  },
  {
    id: 3,
    fee: 190,
    distance: tr('150 à 250 km', '150 tot 250 km', '150 to 250 km'),
    examples: tr(
      'Luxembourg, Arlon, Bouillon, Rotterdam, La Haye, Utrecht, Amsterdam, Côte d’Opale, Amiens, Reims',
      'Luxemburg, Aarlen, Bouillon, Rotterdam, Den Haag, Utrecht, Amsterdam, Opaalkust, Amiens, Reims',
      'Luxembourg, Arlon, Bouillon, Rotterdam, The Hague, Utrecht, Amsterdam, Opal Coast, Amiens, Reims',
    ),
  },
  {
    id: 4,
    fee: 290,
    distance: tr('250 à 350 km', '250 tot 350 km', '250 to 350 km'),
    examples: tr('Paris, Île-de-France, Chantilly', 'Parijs, Île-de-France, Chantilly', 'Paris, Île-de-France, Chantilly'),
  },
  {
    id: 5,
    fee: null,
    distance: tr('Plus de 350 km et étranger', 'Meer dan 350 km en buitenland', 'Over 350 km and abroad'),
    examples: tr(
      'Mariages et tournages à l’étranger : sur devis',
      'Huwelijken en opnames in het buitenland: op offerte',
      'Destination weddings and shoots abroad: on quote',
    ),
  },
];

export function travelZone(id: TravelZoneId): TravelZone {
  return TRAVEL_ZONES.find((z) => z.id === id) ?? TRAVEL_ZONES[0];
}

/**
 * Nuit d'hôtel proposée pour un mariage en zone 3 ou 4 : la soirée finit
 * tard, le retour le soir même n'est pas raisonnable. Montant à valider par
 * le client (proposition, pas encore un tarif confirmé).
 */
export const HOTEL_NIGHT_FEE = 150;
