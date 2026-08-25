# HavenMotion

Site statique repris de la base **Hugee** (système de design « Trame », thème sombre).

## Contenu

| Chemin | Rôle |
| --- | --- |
| `index.html` | Page d'accueil (one-page) |
| `tarifs.html` | Page tarifs |
| `css/tokens.css` | Variables de design (couleurs, typo, espacements) |
| `css/app.css` | Styles du système « Trame » |
| `js/scene.js` | Scènes three.js |
| `js/motion.js` | Animations au scroll et à la souris |

## Développement

Aucune étape de build : ce sont des fichiers statiques. Servir la racine
avec n'importe quel serveur local, par exemple :

```bash
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000/

## Déploiement

`.github/workflows/deploy.yml` fait un `rsync` vers le VPS. Il est en
**déclenchement manuel** (`workflow_dispatch`) tant que la cible de
HavenMotion n'est pas confirmée.

Avant le premier déploiement :

1. Vérifier `DEPLOY_HOST`, `DEPLOY_PATH` et `DEPLOY_URL` en tête du workflow.
   `rsync --delete` efface le contenu du dossier cible — ne pas pointer vers
   `/var/www/hugee/`.
2. Ajouter le secret `VPS_SSH_KEY` dans les paramètres du dépôt.
3. Repasser le déclencheur en `push: branches: [main]` si un déploiement
   automatique est souhaité.

## À faire

- [ ] Décider si l'identité visible (`Hugee`) doit être renommée en `HavenMotion`
      dans les titres, métadonnées, en-têtes et pieds de page.
