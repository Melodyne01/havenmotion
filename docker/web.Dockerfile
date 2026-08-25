# --- Build -------------------------------------------------------------------
FROM node:22-bookworm-slim AS build
WORKDIR /src

COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY apps/web/ .
RUN npm run build

# --- Run ---------------------------------------------------------------------
FROM node:22-bookworm-slim AS run
WORKDIR /app

COPY --from=build --chown=node:node /src/dist/web ./dist/web
COPY docker/web-entrypoint.sh /usr/local/bin/web-entrypoint.sh
RUN chmod +x /usr/local/bin/web-entrypoint.sh

ENV PORT=4000
EXPOSE 4000
USER node
ENTRYPOINT ["web-entrypoint.sh"]
CMD ["node", "dist/web/server/server.mjs"]
