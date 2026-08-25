// Configuration runtime du front. Ce fichier est régénéré au démarrage du
// conteneur par `docker/web-entrypoint.sh` à partir des variables
// d'environnement VNL_API_BASE_URL et VNL_SITE_ORIGIN.
// Ne contient que des URL publiques : aucun secret ne doit y être ajouté.
window.__VNL_CONFIG__ = {
  apiBaseUrl: '/api',
  siteOrigin: 'https://studiovnl.fr',
};
