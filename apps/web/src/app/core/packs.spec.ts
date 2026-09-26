import { CATEGORY_SLUG_MAP, SITE_LOCALES } from './locale';
import { PRICING, comboSaving, formatPrice, pricingFor, startingPrice } from './packs';
import { PRICING_OPTIONS } from './pricing-options';
import { REGIONS } from './regions';
import { TRAVEL_ZONES, travelZone } from './travel-zones';

/**
 * Garde-fous sur la grille tarifaire : ces règles sont ce que le site
 * promet en toutes lettres (« le combo coûte moins cher que les deux
 * formules séparées », « quatre formules par catégorie ») — une erreur de
 * saisie dans `packs.ts` doit casser un test, pas une page publique.
 */
describe('PRICING', () => {
  it('couvre les six catégories, dans le même ordre que la navigation', () => {
    expect(PRICING.map((p) => p.key)).toEqual([
      'mariage',
      'evenementiel',
      'corporate',
      'sport',
      'clip',
      'lifestyle',
    ]);
    for (const entry of CATEGORY_SLUG_MAP) {
      expect(() => pricingFor(entry.fr as never)).not.toThrow();
    }
  });

  it('propose exactement photo, vidéo, combo et sur mesure dans chaque catégorie', () => {
    for (const pricing of PRICING) {
      expect(pricing.packs.map((p) => p.type)).toEqual(['photo', 'video', 'combo', 'custom']);
      expect(pricing.packs.find((p) => p.type === 'custom')?.price).toBeNull();
    }
  });

  it('vend le combo moins cher que photo + vidéo séparés, mais plus cher que chacun', () => {
    for (const pricing of PRICING) {
      const price = (type: string) => pricing.packs.find((p) => p.type === type)?.price ?? 0;
      expect(comboSaving(pricing)).toBeGreaterThan(0);
      expect(price('combo')).toBeGreaterThan(price('photo'));
      expect(price('combo')).toBeGreaterThan(price('video'));
    }
  });

  it('reprend les prix validés par le client', () => {
    const combo = (key: string) => pricingFor(key as never).packs.find((p) => p.type === 'combo')?.price;
    expect(combo('mariage')).toBe(2690);
    expect(combo('evenementiel')).toBe(890);
    expect(combo('corporate')).toBe(1390);
    expect(combo('sport')).toBe(850);
    expect(combo('clip')).toBe(1090);
    expect(combo('lifestyle')).toBe(640);
    expect(startingPrice('mariage')).toBe(1290);
    expect(startingPrice('lifestyle')).toBe(250);
  });

  it('affiche TTC aux particuliers et HTVA aux professionnels', () => {
    const vat = (key: string) => pricingFor(key as never).vat;
    expect(vat('mariage')).toBe('ttc');
    expect(vat('evenementiel')).toBe('ttc');
    expect(vat('lifestyle')).toBe('ttc');
    expect(vat('corporate')).toBe('htva');
    expect(vat('sport')).toBe('htva');
    expect(vat('clip')).toBe('htva');
  });

  it('fournit chaque texte dans les trois langues, sans chaîne vide', () => {
    for (const pricing of PRICING) {
      for (const pack of pricing.packs) {
        for (const locale of SITE_LOCALES) {
          expect(pack.duration[locale]).not.toBe('');
          expect(pack.deliverables[locale]).not.toBe('');
          expect(pack.included[locale].length).toBeGreaterThan(0);
        }
      }
    }
    for (const option of PRICING_OPTIONS) {
      for (const locale of SITE_LOCALES) {
        expect(option.name[locale]).not.toBe('');
        expect(option.description[locale]).not.toBe('');
      }
    }
  });

  it('formate les montants à la belge, avec un espace insécable', () => {
    expect(formatPrice(1290)).toBe('1 290 €');
    expect(formatPrice(390)).toBe('390 €');
  });
});

describe('TRAVEL_ZONES et REGIONS', () => {
  it('numérote cinq zones croissantes, la première incluse et la dernière sur devis', () => {
    expect(TRAVEL_ZONES.map((z) => z.id)).toEqual([1, 2, 3, 4, 5]);
    expect(TRAVEL_ZONES[0].fee).toBe(0);
    expect(TRAVEL_ZONES[4].fee).toBeNull();
    const fees = TRAVEL_ZONES.slice(0, 4).map((z) => z.fee ?? 0);
    expect([...fees].sort((a, b) => a - b)).toEqual(fees);
  });

  it('rattache chaque région à une zone existante et à au moins une langue', () => {
    for (const region of REGIONS) {
      expect(travelZone(region.zone).id).toBe(region.zone);
      expect(region.languages.length).toBeGreaterThan(0);
    }
  });

  it('place Bruxelles en zone incluse, Lille en zone 2, Luxembourg en zone 3 et Paris en zone 4', () => {
    const zoneOf = (slugFr: string) => REGIONS.find((r) => r.slug.fr === slugFr)?.zone;
    expect(zoneOf('bruxelles')).toBe(1);
    expect(zoneOf('lille-nord')).toBe(2);
    expect(zoneOf('luxembourg')).toBe(3);
    expect(zoneOf('paris-ile-de-france')).toBe(4);
  });

  it('garde des slugs uniques par langue', () => {
    for (const locale of SITE_LOCALES) {
      const slugs = REGIONS.map((r) => r.slug[locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});
