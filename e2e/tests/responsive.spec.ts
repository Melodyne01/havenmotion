import { expect, test } from '@playwright/test';

/**
 * Chantier 13 : aucune page de référence ne doit défiler horizontalement,
 * du petit téléphone au bureau. Le test signale l'élément qui dépasse, pour
 * corriger sans deviner.
 */
const PAGES = [
  '/',
  '/tarifs',
  '/prestations/mariage',
  '/prestations/corporate',
  '/photo-et-video-une-seule-personne',
  '/zones',
  '/zones/allemagne',
  '/zones/allemagne/aix-la-chapelle-eifel',
  '/zones/belgique/bruxelles',
  '/guides',
  '/guides/prix-photographe-videaste-mariage-belgique-2026',
  '/guides/drone-mariage-belgique-ce-qui-est-autorise',
  '/contact',
  '/faq',
  '/a-propos',
  '/a-propos/faits',
  '/projets',
  '/mentions-legales',
  '/nl/tarieven',
  '/en/areas/germany/cologne-dusseldorf',
];

const WIDTHS = [360, 768, 1024, 1440];

for (const width of WIDTHS) {
  test(`aucun débordement horizontal à ${width} px`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 800 });
    const failures: string[] = [];
    for (const path of PAGES) {
      await page.goto(path);
      const overflow = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= vw) {
          return null;
        }
        const culprit = [...document.querySelectorAll('body *')]
          .reverse()
          .find((el) => el.getBoundingClientRect().right > vw + 1 && getComputedStyle(el).position !== 'fixed');
        return culprit ? `${culprit.tagName.toLowerCase()}.${culprit.className}` : 'inconnu';
      });
      if (overflow) {
        failures.push(`${path} → ${overflow}`);
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });
}

test('l’Allemagne a sa page pays et ses régions dans les bonnes langues', async ({ page, request }) => {
  await page.goto('/zones/allemagne');
  await expect(page.getByRole('heading', { level: 1, name: /allemagne/i })).toBeVisible();
  await page.goto('/en/areas/germany/cologne-dusseldorf');
  await expect(page.getByRole('heading', { level: 1, name: /cologne/i })).toBeVisible();
  // Cologne n'existe qu'en anglais : vrai 404 en français.
  const missing = await request.get('/zones/allemagne/cologne-dusseldorf');
  expect(missing.status()).toBe(404);
});
