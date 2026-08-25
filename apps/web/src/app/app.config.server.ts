import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { APP_CONFIG } from './core/app-config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      // Côté serveur, l'API est jointe directement (réseau interne du
      // conteneur) plutôt que via l'URL publique.
      provide: APP_CONFIG,
      useFactory: () => ({
        apiBaseUrl: process.env['VNL_API_BASE_URL'] ?? 'http://localhost:5080/api',
        siteOrigin: process.env['VNL_SITE_ORIGIN'] ?? 'https://heavenmotion.be',
      }),
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
