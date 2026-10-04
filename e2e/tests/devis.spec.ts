import { expect, test } from '@playwright/test';

/**
 * Parcours de référence : hero → survol d'une bande → popup de devis →
 * message pré-construit prêt à partir par e-mail ou WhatsApp.
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

  // Plus aucun envoi au serveur : la demande part par WhatsApp ou e-mail.
  let leadCalls = 0;
  await page.route('**/api/public/leads', async (route) => {
    leadCalls++;
    await route.abort();
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

  // 5. Le CTA du hero ouvre le popup de devis, sans quitter la page.
  // Le popup s'active une fois l'application démarrée ; avant, le lien
  // mène (volontairement) à la section contact.
  await page.locator('html[data-quote-ready]').waitFor({ state: 'attached' });
  await page.locator('app-hero').getByRole('link', { name: /demander un devis/i }).click();
  const dialog = page.getByRole('dialog', { name: /votre demande de devis/i });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
  // Ni date ni e-mail dans le formulaire.
  await expect(dialog.locator('input[type="date"], input[type="email"]')).toHaveCount(0);

  // 6. Étape 1 : des boutons à choisir, aucune liste déroulante.
  await expect(dialog.locator('select')).toHaveCount(0);
  const choice = (name: RegExp) => dialog.locator('label.choice').filter({ hasText: name });
  await choice(/^Mariage$/).click();
  await choice(/Photo \+ vidéo/).click();
  await dialog.getByRole('button', { name: /continuer/i }).click();

  // 7. Étape 2 : pays, région, budget ; la région affiche le forfait.
  await choice(/^France$/).click();
  await choice(/^Lille – Nord$/).click();
  await expect(dialog.locator('#popup-travel-hint')).toContainText('90');
  await choice(/^2 000 – 5 000 €$/).click();
  await dialog.getByRole('button', { name: /continuer/i }).click();

  // 8. Étape 3 : le message se compose en direct et part par WhatsApp
  // (canal principal) ou par e-mail.
  await dialog.locator('#popup-name').fill('Camille Martin');
  await dialog.locator('#popup-message').fill('Cérémonie fin d’après-midi.');
  const preview = dialog.locator('#popup-preview');
  await expect(preview).toContainText('Je m’appelle Camille Martin');
  await expect(preview).toContainText(/Photo \+ vidéo \(à partir de 2.690.€ TTC\)/);
  await expect(preview).toContainText(/Lille – Nord \(déplacement : 90.€\)/);
  await expect(preview).toContainText('Cérémonie fin d’après-midi.');
  const whatsapp = dialog.getByRole('link', { name: /envoyer sur whatsapp/i });
  await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/32477753577\?text=Bonjour%20Heaven%20Motion/);
  await expect(whatsapp).toHaveAttribute('target', '_blank');
  const mail = dialog.getByRole('link', { name: /envoyer par e-mail/i });
  await expect(mail).toHaveAttribute('href', /^mailto:.+\?subject=.+&body=Bonjour/);

  // 9. Échap ferme le popup ; rien n'est parti vers le serveur.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  expect(leadCalls).toBe(0);

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

  // Phase 2 : Anvers en trois langues, Hainaut en français seulement, l'étranger en anglais.
  for (const [path, heading] of [
    ['/zones/belgique/anvers', /anvers/i],
    ['/nl/zones/belgie/antwerpen', /antwerpen/i],
    ['/en/areas/belgium/antwerp', /antwerp/i],
    ['/zones/belgique/hainaut', /hainaut/i],
    ['/nl/zones/nederland/noord-brabant', /noord-brabant/i],
    ['/en/areas/international/destination', /abroad/i],
    ['/zones/france/champagne', /champagne/i],
    ['/en/areas/france/paris', /paris/i],
    ['/nl/zones/nederland/zeeland', /zeeland/i],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
  const hainautNl = await request.get('/nl/zones/belgie/henegouwen');
  expect(hainautNl.status()).toBe(404);

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
  await expect(page.locator('.guides__item')).toHaveCount(11);

  for (const [path, heading] of [
    ['/guides/prix-photographe-videaste-mariage-belgique-2026', /combien coûte/i],
    ['/nl/gidsen/wat-kost-een-huwelijksfotograaf-en-videograaf-belgie-2026', /wat kost/i],
    ['/en/guides/wedding-photographer-cost-belgium-2026', /how much/i],
    ['/guides/prix-video-entreprise-belgique-2026', /vidéo d’entreprise/i],
    ['/en/guides/getting-married-in-brussels-expat-guide', /getting married in brussels/i],
    ['/nl/gidsen/drone-op-een-huwelijk-in-belgie-wat-mag', /drone/i],
    ['/guides/photos-communion-profession-de-foi-quand-ou-combien', /communion/i],
    ['/en/guides/linkedin-headshot-what-works-2026', /linkedin headshot/i],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('.guide__table').first()).toBeVisible();
    await expect(page.locator('.guide__faq dt').first()).toBeVisible();
    await expect(page.locator('app-pack-grid')).toBeVisible();
    expect(await page.content()).toContain('"@type":"Article"');
  }

  await page.goto('/guides/prix-photographe-videaste-mariage-belgique-2026');
  await expect(page.locator("link[rel='alternate'][hreflang='nl']")).toHaveAttribute('href', /\/nl\/gidsen\/wat-kost-een-huwelijksfotograaf-en-videograaf-belgie-2026$/);

  const missing = await request.get('/guides/guide-qui-n-existe-pas');
  expect(missing.status()).toBe(404);
});

/**
 * Les liens « Choisir cette formule » ouvrent le popup prérempli ; la page
 * Contact garde le formulaire dans la page, prérempli par l'URL.
 */
test('les formules ouvrent le popup prérempli et la page contact garde le formulaire', async ({ page }) => {
  await page.goto('/prestations/corporate');
  await page.locator('html[data-quote-ready]').waitFor({ state: 'attached' });
  await page.getByRole('link', { name: /choisir cette formule/i }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const checked = dialog.locator('label.choice input:checked');
  await expect(checked).toHaveCount(2);
  await expect(checked.nth(0)).toHaveValue('corporate');
  await expect(checked.nth(1)).toHaveValue('photo');
  await dialog.getByRole('button', { name: /fermer/i }).click();
  await expect(dialog).toBeHidden();

  await page.goto('/en/contact?categorie=sport&region=bruxelles');
  await expect(page.locator('label.choice input:checked[value="sport"]')).toHaveCount(1);
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.locator('label.choice input:checked[value="bruxelles"]')).toHaveCount(1);
  await page.getByRole('button', { name: /continue/i }).click();
  await page.locator('#page-name').fill('Alex');
  await expect(page.locator('#page-preview')).toContainText(/Hello Heaven Motion,[\s\S]*Project: Sport/);
});
