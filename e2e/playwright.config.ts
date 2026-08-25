import { defineConfig } from '@playwright/test';

/**
 * Parcours e2e sur le rendu SSR du site (construit au préalable via
 * `npm run build` dans apps/web). Les appels à l'API sont interceptés :
 * le test est hermétique, aucun backend n'est requis.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: process.env['CI'] ? 1 : 0,
  use: {
    baseURL: 'http://localhost:4326',
    launchOptions: process.env['PLAYWRIGHT_CHROMIUM_PATH']
      ? { executablePath: process.env['PLAYWRIGHT_CHROMIUM_PATH'] }
      : {},
  },
  webServer: {
    command: 'node ../apps/web/dist/web/server/server.mjs',
    url: 'http://localhost:4326',
    env: { PORT: '4326', VNL_ALLOWED_HOSTS: 'localhost' },
    reuseExistingServer: !process.env['CI'],
  },
});
