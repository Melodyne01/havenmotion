import { CategoryKey, SiteLocale } from './locale';

/**
 * Options à la carte, ajoutables à n'importe quel pack. Les montants du
 * drone, de l'heure supplémentaire, de l'express et de l'album viennent de
 * la liste demandée par le client ; le second opérateur et la nuit d'hôtel
 * sont des propositions faites avec, à valider — ils sont affichés parce que
 * la transparence est l'argument, mais un mot au client suffit à les retirer.
 */
export interface PricingOption {
  readonly id: string;
  readonly name: Readonly<Record<SiteLocale, string>>;
  readonly description: Readonly<Record<SiteLocale, string>>;
  /** Prix en euros ; `from` = "à partir de". */
  readonly price: number;
  readonly from?: boolean;
  /** Catégories où l'option a un sens ; absent = toutes. */
  readonly categories?: readonly CategoryKey[];
}

const tr = (fr: string, nl: string, en: string): Readonly<Record<SiteLocale, string>> => ({ fr, nl, en });

export const PRICING_OPTIONS: readonly PricingOption[] = [
  {
    id: 'drone',
    name: tr('Drone', 'Drone', 'Drone'),
    description: tr(
      'Photos et plans aériens, sous réserve d’autorisation de vol — Bruxelles est une zone très restreinte, la plupart des lieux hors ville sont possibles.',
      'Luchtfoto’s en -beelden, mits vliegtoelating — Brussel is een sterk beperkte zone, de meeste locaties buiten de stad zijn mogelijk.',
      'Aerial photos and footage, subject to flight authorisation — Brussels is heavily restricted, most venues outside the city are fine.',
    ),
    price: 190,
  },
  {
    id: 'extra-hour',
    name: tr('Heure supplémentaire', 'Extra uur', 'Extra hour'),
    description: tr(
      '150 € pour la photo ou la vidéo seule, 220 € pour les deux. Décidée sur place si la soirée s’étire.',
      '€ 150 voor foto of video alleen, € 220 voor beide. Ter plaatse te beslissen als de avond uitloopt.',
      '€150 for photo or video alone, €220 for both. Decided on the day if the party runs late.',
    ),
    price: 150,
    from: true,
  },
  {
    id: 'express',
    name: tr('Livraison express', 'Snelle levering', 'Express delivery'),
    description: tr(
      'Délai de livraison divisé par deux, photos et film.',
      'Levertijd gehalveerd, foto’s en film.',
      'Delivery time halved, photos and film.',
    ),
    price: 190,
  },
  {
    id: 'album',
    name: tr('Album photo imprimé', 'Gedrukt fotoalbum', 'Printed photo album'),
    description: tr(
      'Album relié, 30 pages, papier mat. Formats et pages supplémentaires sur devis.',
      'Gebonden album, 30 pagina’s, mat papier. Andere formaten en extra pagina’s op offerte.',
      'Bound album, 30 pages, matte paper. Other sizes and extra pages on quote.',
    ),
    price: 390,
    from: true,
    categories: ['mariage', 'evenementiel', 'lifestyle'],
  },
  {
    id: 'second-operator',
    name: tr('Second opérateur', 'Tweede operator', 'Second operator'),
    description: tr(
      'Recommandé au-delà de 120 invités ou pour une cérémonie religieuse longue : un second angle pendant les moments simultanés.',
      'Aanbevolen vanaf 120 gasten of bij een lange religieuze ceremonie: een tweede camerahoek tijdens gelijktijdige momenten.',
      'Recommended above 120 guests or for a long religious ceremony: a second angle during simultaneous moments.',
    ),
    price: 490,
    categories: ['mariage', 'evenementiel'],
  },
  {
    id: 'hotel',
    name: tr('Nuit d’hôtel', 'Hotelovernachting', 'Hotel night'),
    description: tr(
      'Pour un mariage en zone 3 ou 4 : la soirée finit tard, le retour le soir même n’est pas raisonnable.',
      'Voor een huwelijk in zone 3 of 4: het feest eindigt laat, dezelfde avond terugrijden is niet redelijk.',
      'For a wedding in zone 3 or 4: the party ends late, driving back the same night is not reasonable.',
    ),
    price: 150,
    categories: ['mariage'],
  },
];

/** Options pertinentes pour une catégorie donnée. */
export function optionsFor(key: CategoryKey): readonly PricingOption[] {
  return PRICING_OPTIONS.filter((o) => !o.categories || o.categories.includes(key));
}
