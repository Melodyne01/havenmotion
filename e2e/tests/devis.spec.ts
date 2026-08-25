import { expect, test } from '@playwright/test';

/**
 * Parcours de référence du cahier des charges :
 * hero → survol d'une bande → modale → formulaire de devis envoyé.
 */
test('du hero à la demande de devis', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  // L'API de devis est interceptée : le test reste hermétique.
  await page.route('**/api/public/leads', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: '00000000-0000-0000-0000-000000000001' }),
    });
  });

  await page.goto('/');

  // 1. Hero : marque et CTA visibles.
  await expect(page.getByRole('heading', { level: 1, name: /studio vnl/i })).toBeVisible();

  // 2. Les cinq bandes de catégories sont là.
  const bands = page.locator('app-category-band');
  await expect(bands).toHaveCount(5);

  // 3. Survol de la première bande : l'invite apparaît.
  const firstBand = bands.first().getByRole('button');
  await firstBand.hover();
  await expect(bands.first().locator('.band__invite')).toBeVisible();

  // 4. Clic : la modale s'ouvre, puis se ferme à la touche Échap.
  await firstBand.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);

  // 5. Formulaire de devis : remplissage et envoi.
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('#name').fill('Camille Martin');
  await page.locator('#email').fill('camille@example.fr');
  await page.locator('#projectType').selectOption('Mariage');
  await page.locator('#eventDate').fill('2026-09-12');
  await page.locator('#budgetRange').selectOption('2 000 – 5 000 €');
  await page.locator('#message').fill('Cérémonie à Lyon, fin d’après-midi.');
  await page.getByRole('button', { name: /envoyer la demande/i }).click();

  // 6. Confirmation inline.
  await expect(page.getByRole('status')).toContainText(/demande envoyée/i);

  // Aucune erreur console sur tout le parcours.
  expect(consoleErrors).toEqual([]);
});
