import { expect, test } from '@playwright/test';

/**
 * Parcours de référence du cahier des charges :
 * hero → survol d'une bande → formulaire de devis envoyé.
 */
test('du hero à la demande de devis', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    // Le test est hermétique (aucun backend réel, voir playwright.config.ts) :
    // SiteStore.load() appelle /api/public/site et /api/public/categories,
    // qui échouent toujours ici et retombent sur le contenu de démarrage —
    // un comportement voulu, pas une erreur applicative. Depuis que /api/*
    // renvoie un vrai 404 (au lieu de l'ancien soft-404 qui masquait
    // l'échec derrière une redirection 200), le navigateur journalise ces
    // deux appels comme des erreurs réseau : bruit attendu, pas un bug.
    if (message.type() === 'error' && !/Failed to load resource/.test(message.text())) {
      consoleErrors.push(message.text());
    }
  });

  // L'API de devis est interceptée : le test reste hermétique.
  let leadBody: Record<string, unknown> | null = null;
  await page.route('**/api/public/leads', async (route) => {
    leadBody = route.request().postDataJSON();
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: '00000000-0000-0000-0000-000000000001' }),
    });
  });

  await page.goto('/');

  // 1. Hero : marque et CTA visibles.
  await expect(page.getByRole('heading', { level: 1, name: /heaven motion/i })).toBeVisible();

  // 2. Les bandes de catégories sont là (six depuis l'ajout d'Événementiel).
  const bands = page.locator('app-category-band');
  await expect(bands).toHaveCount(6);

  // 3. Survol de la première bande : l'invite apparaît. C'est un vrai lien
  // (routerLink), pas un bouton, pour rester crawlable par les moteurs.
  const firstBand = bands.first().getByRole('link');
  await firstBand.hover();
  await expect(bands.first().locator('.band__invite')).toBeVisible();

  // 4. La bande est un vrai lien crawlable vers sa page catégorie (les
  // catégories sont des pages dédiées indexables, pas une modale), sous
  // `/prestations/` depuis l'arrivée des packs.
  await expect(firstBand).toHaveAttribute('href', /^\/prestations\//);

  // 5. Formulaire de devis : remplissage et envoi.
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('#name').fill('Camille Martin');
  await page.locator('#email').fill('camille@example.fr');
  await page.locator('#projectType').selectOption('Mariage');
  await page.locator('#pack').selectOption('combo');
  // Choisir une région affiche le forfait de déplacement avant l'envoi.
  await page.locator('#region').selectOption('lille-nord');
  await expect(page.locator('#travel-hint')).toContainText('90');
  await page.locator('#eventDate').fill('2026-09-12');
  await page.locator('#budgetRange').selectOption('2 000 – 5 000 €');
  await page.locator('#message').fill('Cérémonie à Lyon, fin d’après-midi.');
  await page.getByRole('button', { name: /envoyer la demande/i }).click();

  // 6. Confirmation inline, et la demande part qualifiée (formule, région, langue).
  await expect(page.getByRole('status')).toContainText(/demande envoyée/i);
  expect(leadBody).toEqual(expect.objectContaining({ pack: 'combo', region: 'lille-nord', locale: 'fr' }));

  // Aucune erreur console sur tout le parcours.
  expect(consoleErrors).toEqual([]);
});

/**
 * Anciennes adresses des pages catégorie : redirection permanente vers
 * `/prestations/…`, et la page tarifs répond dans les trois langues.
 */
test('les anciennes URL redirigent et la page tarifs existe en FR, NL et EN', async ({ page, request }) => {
  const legacy = await request.get('/realisations/mariage', { maxRedirects: 0 });
  expect(legacy.status()).toBe(301);
  expect(legacy.headers()['location']).toBe('/prestations/mariage');

  const legacyNl = await request.get('/nl/realisaties/huwelijk', { maxRedirects: 0 });
  expect(legacyNl.status()).toBe(301);
  expect(legacyNl.headers()['location']).toBe('/nl/diensten/huwelijk');

  for (const [path, heading] of [
    ['/tarifs', /tarifs photo & vidéo 2026/i],
    ['/nl/tarieven', /tarieven foto & video 2026/i],
    ['/en/pricing', /photo & video pricing 2026/i],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    // Les trois versions se déclarent mutuellement en hreflang.
    await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute('href', /\/en\/pricing$/);
  }

  // Une page catégorie EN affiche sa grille de formules.
  await page.goto('/en/services/wedding');
  await expect(page.getByRole('heading', { level: 1, name: /wedding/i })).toBeVisible();
  await expect(page.locator('app-pack-grid .pack')).toHaveCount(4);
});
