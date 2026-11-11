# Heaven Motion — site « Cinéma »

Site vitrine de **Heaven Motion**, photographe et vidéaste indépendant basé à
Bruxelles (une seule personne pour la photo et la vidéo), qui travaille en
Belgique, dans le nord de la France jusqu'à Paris, au Luxembourg et aux
Pays-Bas. Six catégories (événementiel, mariage, corporate, sport, clip,
lifestyle), chacune vendue en quatre formules à prix affiché (photo, vidéo,
photo + vidéo, sur mesure). Site en français (racine), néerlandais (`/nl`) et
anglais (`/en`). Direction artistique « Cinéma » (noir & ambre), objectif
unique : **décrocher des demandes de devis**.

La stratégie SEO/GEO et le découpage en chantiers sont dans
[`docs/plan-chantiers-seo.md`](docs/plan-chantiers-seo.md). Les prix, options,
zones de déplacement et régions sont des dictionnaires typés dans
`apps/web/src/app/core/` (`packs.ts`, `pricing-options.ts`, `travel-zones.ts`,
`regions.ts`) : un changement de prix est un changement de code + déploiement,
comme pour le reste du contenu marketing (`site-content.ts`).

| Dossier | Contenu |
| --- | --- |
| `apps/web` | Front **Angular 20** (SSR) : site public + backoffice `/admin` |
| `apps/api` | API **.NET 8** (ASP.NET Core, EF Core + PostgreSQL) |
| `e2e` | Parcours **Playwright** : hero → bande → modale → devis |
| `docker` | Dockerfiles API et Web + entrypoint runtime |
| `legacy` | Ancien site statique HavenMotion (conservé pour référence) |
| `.github/workflows` | CI (build/lint/tests) + déploiement auto sur `master`/`main` |

## Démarrage rapide (dev)

Pré-requis : Node 22+, Docker (pour Postgres/MinIO/Mailpit), et le SDK .NET 8
si vous lancez l'API hors conteneur.

```bash
# 1. Services d'infrastructure + API
docker compose up -d          # postgres + minio + mailpit + api (port 5080)

# 2. Front (proxy /api → localhost:5080)
cd apps/web
npm ci
npm start                     # http://localhost:4200
```

L'API seule, hors Docker :

```bash
cd apps/api
dotnet run --project src/StudioVnl.Api    # http://localhost:5080 (Swagger en dev)
```

Sans backend démarré, le site public retombe automatiquement sur le contenu
placeholder.

### Boucles d'ambiance (provisoire)

En attendant les vraies vidéos du studio, les cinq bandes et le showreel
jouent des boucles fabriquées pour le site : dérive lumineuse ambre sur fond
charbon, grain argentique, halo anamorphique. Elles sont servies par le site
lui-même — aucun CDN tiers, donc aucun lien qui puisse mourir, et le rendu est
identique hors ligne.

| Où | Fichier |
| --- | --- |
| Fichiers servis | `apps/web/public/ambience/*.webm` + `*.jpg` (poster) |
| Générateur | `apps/web/tools/generate-ambience.py` |
| Front (repli hors API) | `apps/web/src/app/core/ambience.ts` |
| API (seed) | `apps/api/src/StudioVnl.Infrastructure/Data/AmbienceFootage.cs` |

Pour régénérer les boucles (les paramètres de chaque plan sont en tête du
script) :

```bash
cd apps/web
pip install numpy pillow
python3 tools/generate-ambience.py
```

Format : VP8/WebM muet, 8 s bouclées. Les navigateurs sans WebM (iOS antérieur
à 14.4) affichent le poster — le cadre reste habillé, il ne bouge pas.

Côté API, une boucle n'est posée que sur un emplacement vide, et plus aucune
n'est ajoutée dès qu'un fichier a été déposé dans la bibliothèque : le contenu
du studio reprend la main sans manipulation.

### Photos : optimisation automatique (ImageSharp)

Toute photo déposée dans le backoffice (couverture, galerie de projet, menu
**Médias**) est optimisée par l'API dès la fin de l'envoi, avec
[ImageSharp](https://sixlabors.com/products/imagesharp/) (100 % .NET, rien à
installer dans le conteneur) :

- redressée selon l'orientation de l'appareil, puis **sans EXIF, IPTC ni XMP**
  (marque du boîtier, date, **position GPS**) ; le profil couleur ICC est gardé ;
- déclinée en **WebP 800, 1600 et 2400 px** de large (jamais agrandie), servies
  en `srcset`/`sizes` par la page projet et les cartes ;
- plus un **JPEG 1600 px** (`share.jpg`, exposé comme `posterUrl`) pour
  `og:image` et les réseaux sociaux ;
- un **texte alternatif FR/NL/EN** se saisit sur chaque photo (à défaut : titre
  du projet, jamais le nom du fichier).

L'original reste stocké (`originals/`) pour un retraitement, mais n'est plus
servi. Les photos déposées avant cette version apparaissent « non optimisée »
dans **Médias** : un bouton les met toutes en file. L'AVIF est servi tel quel
(ImageSharp ne le décode pas). Limites : 100 Mo et 120 mégapixels par photo.

| Où | Fichier |
| --- | --- |
| Pipeline partagé (API + outil) | `apps/api/src/StudioVnl.Imaging/WebImage.cs` |
| Traitement à l'upload | `apps/api/src/StudioVnl.Infrastructure/Images/ImageSharpProcessor.cs` (réglages : section `Images` de la config) |
| `srcset` côté front | `apps/web/src/app/shared/ui/responsive-image.ts` |

**Galeries des pages de prestation** (`/prestations/<catégorie>`) : ces photos
sont dans le dépôt (`apps/web/public/photos/<catégorie>/<slug>-800.webp` et
`-1600.webp`, liste dans `apps/web/src/app/core/category-photos.ts`). L'outil
ci-dessous les fabrique avec exactement les mêmes réglages et affiche les
entrées TypeScript à coller (dimensions comprises) :

```bash
dotnet run --project apps/api/tools/StudioVnl.PhotoTool -- mariage ~/Photos/selection-mariage
```

Nommez les fichiers comme ce qu'ils montrent (`premiere-danse-maries.jpg`) : le
nom devient le slug, donc l'URL de l'image. Complétez ensuite les textes
alternatifs (`TODO`) dans `category-photos.ts`.

#### Clé de licence Six Labors (obligatoire pour la prod)

ImageSharp est sous [Six Labors Split License](https://sixlabors.com/pricing/) :
Apache 2.0 gratuite pour une entreprise ou un indépendant **sous 1 M$ de
chiffre d'affaires annuel**, licence commerciale au-delà. Depuis la 3.2, un
build **Release** échoue sans clé (un build Debug passe avec un avertissement,
donc `dotnet run` et `dotnet test` en local fonctionnent sans rien faire).

1. Créer la clé gratuite (« community ») sur https://sixlabors.com/pricing/.
   Si elle est limitée à un assembly, la demander pour **`StudioVnl.Imaging`**
   (le seul projet qui référence ImageSharp).
2. Ajouter le secret GitHub **`SIXLABORS_LICENSE_KEY`** (Settings → Secrets and
   variables → Actions). La CI (`dotnet build -c Release`, image Docker) et les
   déploiements le lisent ; tant qu'il manque, le build de l'image API échoue.
3. En local, pour `docker compose up` ou un build Release :
   `export SIXLABORS_LICENSE_KEY=…` (MSBuild lit aussi `SixLaborsLicenseKey`).

La clé passe en secret BuildKit (`--secret id=sixlabors_license`) : elle
n'apparaît ni dans une couche, ni dans l'image livrée au VPS.

### Comptes de démo

Le seed crée toujours un compte admin par défaut (dev comme prod) :

- **admin@heavenmotion.be** / `HeavenMotion2026!` → rôle `Admin`

À la première connexion, le backoffice impose de choisir un nouveau mot de
passe (page **Mon compte**). Tant que ce n'est pas fait, le mot de passe par
défaut est réappliqué à chaque démarrage ; une fois choisi, il n'est plus
jamais écrasé (sauf `ADMIN_RESET_PASSWORD=true`, voir « Configuration »).
`Seed:AdminEmail` / `Seed:AdminPassword` remplacent l'e-mail et le mot de passe
par défaut si besoin.

Gestion du mot de passe depuis le backoffice :

- **Mon compte** (`/admin/compte`) : changer son mot de passe (l'actuel est
  demandé ; les autres sessions sont déconnectées) ;
- **Mot de passe oublié ?** sur l'écran de connexion
  (`/admin/mot-de-passe-oublie`) : un lien valable 1 h, à usage unique, part
  par e-mail vers `/admin/reinitialiser-mot-de-passe`. Le lien est construit
  sur `Site__Origin` et l'envoi passe par le SMTP (`Email__*`) : en prod, il
  faut un SMTP fonctionnel et une boîte qui reçoit bien les mails de l'adresse
  admin.

Backoffice : http://localhost:4200/admin — e-mails visibles dans Mailpit :
http://localhost:8025.

### Base de données & migrations

Au premier démarrage l'API applique les migrations EF Core si elles existent,
sinon crée le schéma (`EnsureCreated`) puis exécute le seed (5 catégories
protégées, prestations, process, témoignages).

Pour générer la migration initiale (recommandé avant la prod) :

```bash
cd apps/api
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate \
  --project src/StudioVnl.Infrastructure \
  --startup-project src/StudioVnl.Api
```

### Tests

```bash
cd apps/api && dotnet test                     # xUnit (validators, mapping)
cd apps/web && npx ng test --watch=false       # Karma/Jasmine
cd apps/web && npx ng lint                     # ESLint
cd apps/web && npx ng build                    # build prod
cd e2e && npx playwright test                  # parcours complet (après build web)
```

## Configuration

Aucun secret dans le dépôt : tout passe par les variables d'environnement
(fichier `.env` en prod, cf. `.env.example`).

| Variable | Rôle |
| --- | --- |
| `ConnectionStrings__Default` | Chaîne PostgreSQL |
| `Jwt__SigningKey` | Clé de signature des jetons (obligatoire en prod) |
| `Seed__AdminEmail` / `Seed__AdminPassword` | Compte admin par défaut (vides : `admin@heavenmotion.be` / `HeavenMotion2026!`) |
| `Seed__ResetAdminPassword` (`ADMIN_RESET_PASSWORD` dans le `.env`) | `true` : remet le compte admin sur le mot de passe par défaut (ou `ADMIN_PASSWORD`) au démarrage, même s'il a été changé (à retirer ensuite) |
| `Email__*` | SMTP (hôte, port, identifiants, expéditeur) |
| `MediaStorage__Provider` | `LocalDisk` (défaut) ou `S3` (MinIO/AWS) |
| `Images__*` | Optimisation des photos : `Widths`, `WebpQuality` (80), `ShareWidth` (1600), `JpegQuality` (82), `MaxPixels` |
| `SIXLABORS_LICENSE_KEY` (secret GitHub / build) | Clé ImageSharp, exigée au build Release (voir plus haut) |
| `Cors__AllowedOrigins__0` | Origine du front |
| `VNL_ALLOWED_HOSTS` (web) | Hôtes acceptés par le serveur SSR |
| `VNL_API_PROXY_TARGET` (web) | Cible du proxy `/api` + `/media` (prod Docker) |
| `VNL_PUBLIC_API_BASE_URL`, `VNL_SITE_ORIGIN` (web) | Config runtime du navigateur |

## Déploiement

Deux pipelines appellent la même mécanique (`deploy-stack.yml`) :

| Pipeline | Déclencheur | URL | Pile sur le VPS | Port web |
| --- | --- | --- | --- | --- |
| `deploy.yml` (prod) | push sur `master`/`main` | https://heavenmotion.be | `/opt/havenmotion` (images `vnl-*:prod`) | 127.0.0.1:4000 |
| `deploy-dev.yml` (dev) | push sur `develop` | https://dev.heavenmotion.be | `/home/deploy/havenmotion-dev` (images `vnl-*:dev`) | 127.0.0.1:4100 |

Chaque déploiement : rsync des sources, génération/réalignement du `.env`
serveur (secrets créés sur place au premier passage ; le backoffice démarre
sur le compte admin par défaut, voir « Comptes de démo »), build des images sur le runner, livraison par
`docker save | ssh | docker load`, `compose up -d --no-build`, puis
vérification HTTP 200 de l'URL publique.

Pré-requis (une seule fois) :

- secret GitHub `VPS_SSH_KEY` (clé privée du compte `deploy`) ;
- secret GitHub `SIXLABORS_LICENSE_KEY` (clé ImageSharp, voir « Photos ») ;
- Docker + plugin compose sur le VPS ;
- DNS + vhost nginx (avec certificat) de chaque domaine vers son port web.

La CI (`ci.yml`) tourne sur chaque PR et branche : lint + tests + build du
front, build + tests de l'API, parcours e2e, et build des deux images Docker.

## Backoffice

Guide client d'une page : [`docs/guide-backoffice.md`](docs/guide-backoffice.md).

## RGPD

- Formulaire de devis minimal, pot de miel anti-spam (pas de captcha tiers).
- Pages mentions légales et politique de confidentialité servies par le front.
- Aucun traceur sans consentement ; conservation des leads limitée (24 mois,
  purge à planifier côté exploitation).
