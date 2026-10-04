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

/**
 * Pages région (chantier 5) : les anciennes pages commune redirigent vers
 * leur région, une région avec contenu se rend avec ses villes et sa FAQ,
 * une région sans contenu dans la langue répond un vrai 404.
 */
test('les pages commune redirigent vers leur région et les pages région se rendent', async ({ page, request }) => {
  const uccle = await request.get('/zones/uccle', { maxRedirects: 0 });
  expect(uccle.status()).toBe(301);
  expect(uccle.headers()['location']).toBe('/zones/belgique/bruxelles');

  const wemmel = await request.get('/nl/zones/wemmel', { maxRedirects: 0 });
  expect(wemmel.status()).toBe(301);
  expect(wemmel.headers()['location']).toBe('/nl/zones/belgie/vlaams-brabant');

  await page.goto('/zones/belgique/bruxelles');
  await expect(page.getByRole('heading', { level: 1, name: /bruxelles/i })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: /dans les communes/i })).toBeVisible();
  await expect(page.locator("link[rel='alternate'][hreflang='en']")).toHaveAttribute('href', /\/en\/areas\/belgium\/brussels$/);

  await page.goto('/en/areas/luxembourg/luxembourg');
  await expect(page.getByRole('heading', { level: 1, name: /luxembourg/i })).toBeVisible();

  // Le Brabant wallon n'a pas de page en anglais : vrai 404, pas une page vide.
  const missing = await request.get('/en/areas/belgium/walloon-brabant');
  expect(missing.status()).toBe(404);

  // La page « une seule personne » existe dans les trois langues.
  await page.goto('/nl/foto-en-video-door-een-persoon');
  await expect(page.getByRole('heading', { level: 1, name: /één persoon/i })).toBeVisible();
});

/**
 * Chantiers 6, 7, 9 : la home n'affiche plus de témoignage d'attente, la
 * page des faits et la liste des projets existent dans les trois langues
 * (vides sans API, sans erreur), un projet inconnu répond 404.
 */
test('plus de témoignage d’attente ; pages faits et projets en trois langues', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByText('Témoignage à compléter')).toHaveCount(0);
  await expect(page.locator('.hero__facts')).toContainText(/une seule personne/i);

  for (const [path, heading] of [
    ['/a-propos/faits', /faits vérifiables/i],
    ['/nl/over-ons/feiten', /verifieerbare feiten/i],
    ['/en/about/facts', /verifiable facts/i],
    ['/projets', /projets réalisés/i],
    ['/en/projects', /completed projects/i],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }

  const missing = await request.get('/projets/mariage-qui-n-existe-pas');
  expect(missing.status()).toBe(404);
});

test('les trois guides prix se rendent, avec FAQ et grille, et un slug inconnu répond 404', async ({ page, request }) => {
  await page.goto('/guides');
  await expect(page.getByRole('heading', { level: 1, name: /guides/i })).toBeVisible();
  await expect(page.locator('.guides__item')).toHaveCount(1);

  for (const [path, heading] of [
    ['/guides/prix-photographe-videaste-mariage-belgique-2026', /combien coûte/i],
    ['/nl/gidsen/wat-kost-een-huwelijksfotograaf-en-videograaf-belgie-2026', /wat kost/i],
    ['/en/guides/wedding-photographer-cost-belgium-2026', /how much/i],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('.guide__table').first()).toBeVisible();
    await expect(page.locator('.guide__faq dt').first()).toBeVisible();
    await expect(page.locator('app-pack-grid')).toBeVisible();
    expect(await page.content()).toContain('"@type":"Article"');
  }

  const missing = await request.get('/guides/guide-qui-n-existe-pas');
  expect(missing.status()).toBe(404);
});
