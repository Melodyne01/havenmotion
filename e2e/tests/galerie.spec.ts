import { expect, test } from "@playwright/test";

/**
 * Pages Mariage, Événementiel, Sport, Clip et Corporate : la galerie affiche les photos du studio, chacune
 * avec un texte alternatif, et aucune image ne reste cassée une fois
 * défilée (les fichiers sont servis par le site, pas par un CDN).
 */
test("la page Mariage affiche sa galerie de photos, toutes chargées", async ({
  page,
}) => {
  await page.goto("/prestations/mariage");

  const photos = page.locator(".gallery__item img");
  await expect(photos).toHaveCount(15);

  for (let i = 0; i < 15; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute("alt", /\S+/);
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});

test("la page Événementiel affiche sa galerie de photos, toutes chargées", async ({
  page,
}) => {
  await page.goto("/prestations/evenementiel");

  const photos = page.locator(".gallery__item img");
  await expect(photos).toHaveCount(9);

  for (let i = 0; i < 9; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute("alt", /\S+/);
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});

test("la page Sport affiche sa galerie de photos, toutes chargées", async ({
  page,
}) => {
  await page.goto("/prestations/sport");

  const photos = page.locator(".gallery__item img");
  await expect(photos).toHaveCount(5);

  for (let i = 0; i < 5; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute("alt", /\S+/);
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});

test("la page Clip affiche sa galerie de photos, toutes chargées", async ({
  page,
}) => {
  await page.goto("/prestations/clip");

  const photos = page.locator(".gallery__item img");
  await expect(photos).toHaveCount(4);

  for (let i = 0; i < 4; i++) {
    const photo = photos.nth(i);
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute("alt", /\S+/);
    await expect
      .poll(() =>
        photo.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
});

test("la page Corporate affiche sa photo, chargée", async ({ page }) => {
  await page.goto("/prestations/corporate");

  const photos = page.locator(".gallery__item img");
  await expect(photos).toHaveCount(1);
  await photos.first().scrollIntoViewIfNeeded();
  await expect(photos.first()).toHaveAttribute("alt", /\S+/);
  await expect
    .poll(() =>
      photos
        .first()
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBe(true);
});

test("une catégorie sans photos n’affiche pas de galerie", async ({ page }) => {
  await page.goto("/prestations/lifestyle");
  await expect(page.locator(".gallery")).toHaveCount(0);
});

/**
 * Visionneuse : toucher une photo l'agrandit en plein écran, dans chaque
 * catégorie illustrée. Flèches, boutons et Échap pilotent la navigation.
 */
for (const [slug, count] of [
  ["mariage", 15],
  ["evenementiel", 9],
  ["sport", 5],
  ["clip", 4],
  ["corporate", 1],
] as const) {
  test(`la page ${slug} agrandit chaque photo dans la visionneuse`, async ({
    page,
  }) => {
    await page.goto(`/prestations/${slug}`);
    const viewer = page.locator("dialog.viewer");
    const thumbnails = page.locator(".gallery__open");
    await expect(thumbnails).toHaveCount(count);

    await thumbnails.first().scrollIntoViewIfNeeded();
    await thumbnails.first().click();
    await expect(viewer).toBeVisible();
    await expect(viewer.locator(".viewer__image")).toHaveAttribute(
      "src",
      new RegExp(`/photos/${slug}/.+-1600\\.webp`),
    );
    await expect(viewer.locator(".viewer__count")).toHaveText(`1 / ${count}`);

    if (count > 1) {
      await page.keyboard.press("ArrowRight");
      await expect(viewer.locator(".viewer__count")).toHaveText(`2 / ${count}`);
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await expect(viewer.locator(".viewer__count")).toHaveText(
        `${count} / ${count}`,
      );
    } else {
      await expect(viewer.locator(".viewer__next")).toHaveCount(0);
    }

    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();

    await thumbnails.last().click();
    await expect(viewer.locator(".viewer__count")).toHaveText(
      `${count} / ${count}`,
    );
    await viewer.getByRole("button", { name: "Fermer" }).click();
    await expect(viewer).toBeHidden();
  });
}
