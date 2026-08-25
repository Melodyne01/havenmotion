#!/bin/sh
# Régénère la configuration runtime du navigateur à partir de l'environnement.
# Aucun secret : uniquement des URL publiques.
set -eu

CONFIG_FILE="dist/web/browser/config.js"
cat > "$CONFIG_FILE" <<CONFIG
window.__VNL_CONFIG__ = {
  apiBaseUrl: '${VNL_PUBLIC_API_BASE_URL:-/api}',
  siteOrigin: '${VNL_SITE_ORIGIN:-https://heavenmotion.be}',
};
CONFIG

exec "$@"
