import { expect, test } from '@playwright/test';

/**
 * Pages Mariage, Événementiel et Sport : la galerie affiche les photos du studio, chacune
 * avec un texte alternatif, et aucune image ne reste cassée une fois
 * défilée (les fichiers sont servis par le site, pas par un CDN).
 */
test('la page Mariage affiche sa galerie de photos, toutes chargées', async ({ page }) => {
  await page.goto('/prestations/mariage');

  const photos = page.locator('.gallery__item img');
  await expect(photos).toHaveCount(15);

  for (let i = 0; i < 15; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute('alt', /\S+/);
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
});

test('la page Événementiel affiche sa galerie de photos, toutes chargées', async ({ page }) => {
  await page.goto('/prestations/evenementiel');

  const photos = page.locator('.gallery__item img');
  await expect(photos).toHaveCount(9);

  for (let i = 0; i < 9; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute('alt', /\S+/);
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
});

test('la page Sport affiche sa galerie de photos, toutes chargées', async ({ page }) => {
  await page.goto('/prestations/sport');

  const photos = page.locator('.gallery__item img');
  await expect(photos).toHaveCount(5);

  for (let i = 0; i < 5; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute('alt', /\S+/);
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
});

test('une catégorie sans photos n’affiche pas de galerie', async ({ page }) => {
  await page.goto('/prestations/corporate');
  await expect(page.locator('.gallery')).toHaveCount(0);
});
