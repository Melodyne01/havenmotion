import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { request as httpRequest } from 'node:http';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * Domaines publics servis par ce processus, séparés par des virgules.
 * Le contrôle d'origine d'Angular est figé à la compilation ; on le double ici
 * d'un contrôle lu dans l'environnement, ce qui permet de changer de domaine
 * sans reconstruire l'image. Tout hôte absent de la liste est rejeté.
 */
const ALLOWED_HOSTS = new Set(
  (process.env['VNL_ALLOWED_HOSTS'] ?? 'localhost')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
);

/** Hôte déclaré dans `angular.json` (`security.allowedHosts`). */
const CANONICAL_HOST = 'localhost';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');

// Contrôle d'hôte (protection SSRF) puis normalisation pour le moteur Angular.
app.use((req, res, next) => {
  const host = (req.headers.host ?? '').toLowerCase();
  const hostname = host.split(':')[0];
  if (!ALLOWED_HOSTS.has(host) && !ALLOWED_HOSTS.has(hostname)) {
    res.status(400).type('text/plain').send('Bad Request: unexpected Host header.');
    return;
  }
  req.headers.host = CANONICAL_HOST;
  next();
});

/**
 * Proxy /api et /media vers le conteneur .NET quand `VNL_API_PROXY_TARGET`
 * est défini (production Docker). Le conteneur web devient l'unique point
 * d'entrée : le reverse proxy de l'hôte n'a qu'une cible.
 */
const proxyTarget = process.env['VNL_API_PROXY_TARGET'];
if (proxyTarget) {
  const target = new URL(proxyTarget);
  app.use(['/api', '/media'], (req, res) => {
    const upstream = httpRequest(
      {
        hostname: target.hostname,
        port: target.port,
        path: req.baseUrl + req.url,
        method: req.method,
        headers: { ...req.headers, host: target.host },
      },
      (response) => {
        res.writeHead(response.statusCode ?? 502, response.headers);
        response.pipe(res);
      },
    );
    upstream.on('error', () => {
      if (!res.headersSent) {
        res.status(502).type('text/plain').send('API indisponible.');
      }
    });
    req.pipe(upstream);
  });
}

// Fichiers statiques du bundle navigateur.
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: (res, path) => {
      // `config.js` porte la configuration runtime : il ne doit jamais être
      // mis en cache, sinon un changement d'URL d'API resterait sans effet.
      if (path.endsWith('config.js')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    },
  }),
);

// Toutes les autres requêtes passent par le rendu Angular.
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Studio VNL — SSR à l'écoute sur http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
