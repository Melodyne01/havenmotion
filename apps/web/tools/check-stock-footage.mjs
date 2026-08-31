#!/usr/bin/env node
/**
 * Vérifie que les extraits de banque référencés par `stock-footage.ts`
 * répondent encore. Ces clips sont provisoires et hébergés par un tiers : un
 * lien peut disparaître sans prévenir, auquel cas la bande retombe sur son
 * poster local. Lancer `npm run check:stock` avant une mise en ligne.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = await readFile(join(root, 'src/app/core/stock-footage.ts'), 'utf8');

// Les URL sont écrites avec un gabarit (`${MIXKIT}/...`) : on le résout.
const base = source.match(/const MIXKIT = '([^']+)'/)?.[1] ?? '';
const urls = [...source.matchAll(/url: `\$\{MIXKIT\}(\/[^`]+)`/g)].map((match) => base + match[1]);

if (urls.length === 0) {
  console.error('Aucune URL trouvée dans stock-footage.ts.');
  process.exit(1);
}

let failures = 0;
for (const url of urls) {
  try {
    // Requête de plage : on ne télécharge que le début du fichier.
    const response = await fetch(url, { headers: { Range: 'bytes=0-1023' } });
    const ok = response.ok || response.status === 206;
    console.log(`${ok ? 'OK  ' : 'KO  '} ${response.status} ${url}`);
    if (!ok) {
      failures += 1;
    }
  } catch (error) {
    console.log(`KO   ---  ${url} (${error.message})`);
    failures += 1;
  }
}

if (failures > 0) {
  console.error(
    `\n${failures} extrait(s) injoignable(s) : remplacer l'URL dans src/app/core/stock-footage.ts` +
      ' (et dans StockFootage.cs côté API).',
  );
  process.exit(1);
}
console.log('\nTous les extraits de banque répondent.');
