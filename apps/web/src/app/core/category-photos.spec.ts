import { CATEGORY_GALLERY_TEXT, CATEGORY_PHOTOS } from './category-photos';
import { SITE_LOCALES } from './locale';

/**
 * Un texte alternatif manquant dans une langue, un slug en double ou une
 * catégorie illustrée sans titre doit casser un test. La présence des
 * fichiers est vérifiée par le parcours e2e de la page Mariage.
 */
describe('CATEGORY_PHOTOS', () => {
  it('a un texte alternatif dans chaque langue et des slugs uniques', () => {
    for (const photos of Object.values(CATEGORY_PHOTOS)) {
      expect(new Set(photos.map((p) => p.slug)).size).toBe(photos.length);
      for (const photo of photos) {
        for (const locale of SITE_LOCALES) {
          expect(photo.alt[locale].trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('a un titre de galerie dans chaque langue pour chaque catégorie illustrée', () => {
    for (const category of Object.keys(CATEGORY_PHOTOS)) {
      for (const locale of SITE_LOCALES) {
        expect(CATEGORY_GALLERY_TEXT[locale][category]?.title).toBeTruthy();
      }
    }
  });
});
