import { expect, test } from '@playwright/test';

/**
 * Mesure Umami : le vrai script (analytics.beetee.be) est remplacé par un
 * faux qui enregistre les événements dans `window.__events`. Le test vérifie
 * les noms et les données réellement envoyés pendant un devis complet.
 */
test.beforeEach(async ({ page }) => {
  await page.route('**/analytics.beetee.be/script.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: 'window.__events = []; window.umami = { track: function (n, d) { window.__events.push([n, d || {}]); } };',
    }),
  );
});

type Tracked = [string, Record<string, unknown>][];
const events = (page: import('@playwright/test').Page) => page.evaluate(() => (window as unknown as { __events: Tracked }).__events);
const names = async (page: import('@playwright/test').Page) => (await events(page)).map(([name]) => name);

test('le tunnel de devis remonte ses étapes et sa conversion WhatsApp', async ({ page, context }) => {
  await page.goto('/prestations/mariage');
  await page.locator('html[data-quote-ready]').waitFor({ state: 'attached' });

  // Une carte tarif : origine « pack-card », préremplissage joint à l'ouverture.
  await page.getByRole('link', { name: /choisir cette formule/i }).nth(2).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(await events(page)).toEqual(
    expect.arrayContaining([
      ['quote_entry_click', expect.objectContaining({ source: 'pack-card' })],
      ['quote_open', expect.objectContaining({ source: 'pack-card', category: 'mariage', pack: 'combo' })],
      ['quote_step_1_project', { form: 'popup' }],
    ]),
  );

  const choice = (name: RegExp) => dialog.locator('label.choice').filter({ hasText: name });
  await dialog.getByRole('button', { name: /continuer/i }).click();
  await choice(/^Belgique$/).click();
  await choice(/^Brabant wallon$/).click();
  await dialog.getByRole('button', { name: /retour/i }).click();
  await dialog.getByRole('button', { name: /continuer/i }).click();
  await dialog.getByRole('button', { name: /continuer/i }).click();

  // Envoi sans nom : bloqué et mesuré.
  await dialog.getByRole('link', { name: /envoyer sur whatsapp/i }).click();
  // Envoi avec nom : conversion (WhatsApp s'ouvre dans un nouvel onglet, refermé aussitôt).
  await dialog.locator('#popup-name').fill('Camille');
  const [whatsapp] = await Promise.all([context.waitForEvent('page'), dialog.getByRole('link', { name: /envoyer sur whatsapp/i }).click()]);
  await whatsapp.close();
  await dialog.getByRole('button', { name: /copier le message/i }).click();
  await page.keyboard.press('Escape');

  const all = await events(page);
  expect(all).toEqual(
    expect.arrayContaining([
      ['quote_step_2_place', expect.objectContaining({ category: 'mariage', pack: 'combo' })],
      ['quote_step_back', expect.objectContaining({ from: 2 })],
      ['quote_step_3_message', expect.objectContaining({ country: 'BE', region: 'brabant-wallon', budget: 'à définir' })],
      ['quote_name_missing', expect.objectContaining({ channel: 'whatsapp' })],
      ['quote_submit_whatsapp', expect.objectContaining({ category: 'mariage', pack: 'combo', region: 'brabant-wallon', lang: 'fr', form: 'popup' })],
      ['quote_copy', expect.objectContaining({ form: 'popup' })],
    ]),
  );
  // Fermé après un envoi : ce n'est pas un abandon.
  expect(all.map(([name]) => name)).not.toContain('quote_abandon');
});

test('fermer le popup sans envoyer est un abandon, à la bonne étape', async ({ page }) => {
  await page.goto('/');
  await page.locator('html[data-quote-ready]').waitFor({ state: 'attached' });
  await page.locator('app-hero').getByRole('link', { name: /demander un devis/i }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('label.choice').filter({ hasText: /^Sport$/ }).click();
  await dialog.getByRole('button', { name: /continuer/i }).click();
  await dialog.getByRole('button', { name: /fermer/i }).click();

  const all = await events(page);
  expect(all).toEqual(
    expect.arrayContaining([
      ['quote_entry_click', expect.objectContaining({ source: 'hero' })],
      ['quote_abandon', { step: 2 }],
    ]),
  );
});

test('e-mail, langue et profondeur de lecture sont mesurés', async ({ page }) => {
  await page.goto('/guides/prix-photographe-videaste-mariage-belgique-2026');
  await page.locator('html[data-quote-ready]').waitFor({ state: 'attached' });

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => names(page)).toEqual(expect.arrayContaining(['scroll-25', 'scroll-50', 'scroll-75', 'scroll-90']));

  await page.goto('/');
  await page.locator('html[data-quote-ready]').waitFor({ state: 'attached' });
  // Le lien e-mail ne doit pas ouvrir de client mail pendant le test.
  await page.evaluate(() =>
    document.addEventListener('click', (e) => (e.target as Element).closest('a[href^="mailto:"]') && e.preventDefault()),
  );
  await page.locator('app-contact a[href^="mailto:"]').click();
  expect(await names(page)).toContain('contact_email_click');

  await page.locator('header a[hreflang="nl"]').click();
  await expect(page).toHaveURL(/\/nl$/);
  expect(await events(page)).toEqual(expect.arrayContaining([['language_switch', { from: 'fr', to: 'nl' }]]));
});
