import { SITE_LOCALES } from './locale';
import { COUNTRY_CONTENT, REGION_CONTENT, regionsWithContent } from './region-content';
import { COUNTRIES, REGIONS, findRegion } from './regions';

/**
 * Garde-fous sur le contenu des pages région : chaque contenu doit
 * correspondre à une région déclarée, dans une langue que cette région
 * annonce, et dire assez de choses (villes, lieux, FAQ) pour mériter une
 * page — une page région creuse est exactement ce que le plan interdit.
 */
describe('REGION_CONTENT', () => {
  it('ne décrit que des régions déclarées dans regions.ts', () => {
    for (const id of Object.keys(REGION_CONTENT)) {
      expect(findRegion(id)).withContext(id).not.toBeNull();
    }
  });

  it('n’écrit une page que dans une langue annoncée par la région', () => {
    for (const [id, byLocale] of Object.entries(REGION_CONTENT)) {
      const region = findRegion(id)!;
      for (const locale of SITE_LOCALES) {
        if (byLocale[locale]) {
          expect(region.languages).withContext(`${id} ${locale}`).toContain(locale);
        }
      }
    }
  });

  it('couvre les cinq régions de phase 1 dans toutes leurs langues', () => {
    const phaseOne = REGIONS.filter((r) => r.phase === 1);
    expect(phaseOne.length).toBe(5);
    for (const region of phaseOne) {
      for (const locale of region.languages) {
        expect(REGION_CONTENT[region.slug.fr]?.[locale]).withContext(`${region.slug.fr} ${locale}`).toBeDefined();
      }
    }
  });

  it('couvre les treize régions de phase 2 dans toutes leurs langues', () => {
    const phaseTwo = REGIONS.filter((r) => r.phase === 2);
    expect(phaseTwo.length).toBe(13);
    for (const region of phaseTwo) {
      for (const locale of region.languages) {
        expect(REGION_CONTENT[region.slug.fr]?.[locale]).withContext(`${region.slug.fr} ${locale}`).toBeDefined();
      }
    }
  });

  it('donne à chaque page au moins quatre villes, six lieux et deux questions', () => {
    for (const [id, byLocale] of Object.entries(REGION_CONTENT)) {
      for (const locale of SITE_LOCALES) {
        const content = byLocale[locale];
        if (!content) {
          continue;
        }
        expect(content.intro.length).withContext(`${id} ${locale} intro`).toBeGreaterThan(200);
        expect(content.cities.length).withContext(`${id} ${locale} villes`).toBeGreaterThanOrEqual(4);
        expect(content.venues.length).withContext(`${id} ${locale} lieux`).toBeGreaterThanOrEqual(6);
        expect(content.faq.length).withContext(`${id} ${locale} faq`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('liste les régions publiées par langue', () => {
    expect(regionsWithContent('fr')).toContain('bruxelles');
    expect(regionsWithContent('en')).toContain('lille-nord');
    expect(regionsWithContent('en')).not.toContain('brabant-wallon');
  });

  it('a un texte pays dans les trois langues pour chaque pays', () => {
    for (const country of COUNTRIES) {
      for (const locale of SITE_LOCALES) {
        expect(COUNTRY_CONTENT[country.code][locale].intro.length).withContext(`${country.code} ${locale}`).toBeGreaterThan(100);
      }
    }
  });
});
