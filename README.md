# Studio VNL — site « Cinéma »

Site vitrine de **Studio VNL**, vidéaste freelance (mariages, corporate, sport,
clips, lifestyle) à Lyon / Auvergne-Rhône-Alpes. Direction artistique
« Cinéma » (noir & ambre), objectif unique : **décrocher des demandes de devis**.

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
placeholder (cadres 2.39:1 noirs portant le nom du fichier attendu).

### Comptes de démo

Le seed crée un compte admin si `Seed:AdminPassword` est défini. En dev
(`appsettings.Development.json` et `docker-compose.yml`) :

- **admin@studiovnl.fr** / `Admin-Demo-2026!` → rôle `Admin`

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
| `Seed__AdminEmail` / `Seed__AdminPassword` | Compte admin créé au premier démarrage |
| `Email__*` | SMTP (hôte, port, identifiants, expéditeur) |
| `MediaStorage__Provider` | `LocalDisk` (défaut) ou `S3` (MinIO/AWS) |
| `Cors__AllowedOrigins__0` | Origine du front |
| `VNL_ALLOWED_HOSTS` (web) | Hôtes acceptés par le serveur SSR |
| `VNL_API_PROXY_TARGET` (web) | Cible du proxy `/api` + `/media` (prod Docker) |
| `VNL_PUBLIC_API_BASE_URL`, `VNL_SITE_ORIGIN` (web) | Config runtime du navigateur |

## Déploiement

Deux pipelines appellent la même mécanique (`deploy-stack.yml`) :

| Pipeline | Déclencheur | URL | Pile sur le VPS | Port web |
| --- | --- | --- | --- | --- |
| `deploy.yml` (prod) | push sur `master`/`main` | https://heavenmotion.be | `/opt/havenmotion` (images `vnl-*:prod`) | 127.0.0.1:4000 |
| `deploy-dev.yml` (dev) | push sur `develop` | https://dev.heavenmotion.be | `/opt/havenmotion-dev` (images `vnl-*:dev`) | 127.0.0.1:4100 |

Chaque déploiement : rsync des sources, génération/réalignement du `.env`
serveur (secrets créés sur place au premier passage, identifiants backoffice
dans `BACKOFFICE-ACCES.txt`), build des images sur le runner, livraison par
`docker save | ssh | docker load`, `compose up -d --no-build`, puis
vérification HTTP 200 de l'URL publique.

Pré-requis (une seule fois) :

- secret GitHub `VPS_SSH_KEY` (clé privée du compte `deploy`) ;
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
