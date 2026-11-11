# --- Build -------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY apps/api/Directory.Build.props apps/api/StudioVnl.sln ./
COPY apps/api/src/StudioVnl.Domain/StudioVnl.Domain.csproj src/StudioVnl.Domain/
COPY apps/api/src/StudioVnl.Application/StudioVnl.Application.csproj src/StudioVnl.Application/
COPY apps/api/src/StudioVnl.Imaging/StudioVnl.Imaging.csproj src/StudioVnl.Imaging/
COPY apps/api/src/StudioVnl.Infrastructure/StudioVnl.Infrastructure.csproj src/StudioVnl.Infrastructure/
COPY apps/api/src/StudioVnl.Api/StudioVnl.Api.csproj src/StudioVnl.Api/
RUN dotnet restore src/StudioVnl.Api/StudioVnl.Api.csproj

COPY apps/api/src/ src/
# ImageSharp (optimisation des photos) exige une clé de licence Six Labors pour
# un build Release. Elle arrive en secret BuildKit — jamais dans une couche ni
# dans l'image finale :
#   docker build --secret id=sixlabors_license,env=SIXLABORS_LICENSE_KEY -f docker/api.Dockerfile .
RUN --mount=type=secret,id=sixlabors_license \
    if [ ! -s /run/secrets/sixlabors_license ]; then \
      echo "Clé Six Labors manquante : définir SIXLABORS_LICENSE_KEY (voir README, section ImageSharp)." >&2; exit 1; \
    fi \
 && SixLaborsLicenseKey="$(cat /run/secrets/sixlabors_license)" \
    dotnet publish src/StudioVnl.Api/StudioVnl.Api.csproj -c Release -o /out /p:UseAppHost=false

# --- Run ---------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS run

# FFmpeg pour le transcodage et l'extraction des posters.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg curl \
 && rm -rf /var/lib/apt/lists/*

# Dossier des médias (volume) appartenant à l'utilisateur non-root de l'image :
# un volume neuf hérite de ces droits. Les volumes déjà créés root:root sont
# réparés au démarrage par le service `media-permissions` (docker-compose).
RUN mkdir -p /data/media && chown "$APP_UID:$APP_UID" /data/media

WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://0.0.0.0:5080
EXPOSE 5080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -sf http://localhost:5080/health || exit 1

USER $APP_UID
ENTRYPOINT ["dotnet", "StudioVnl.Api.dll"]
