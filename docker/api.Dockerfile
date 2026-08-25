# --- Build -------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY apps/api/Directory.Build.props apps/api/StudioVnl.sln ./
COPY apps/api/src/StudioVnl.Domain/StudioVnl.Domain.csproj src/StudioVnl.Domain/
COPY apps/api/src/StudioVnl.Application/StudioVnl.Application.csproj src/StudioVnl.Application/
COPY apps/api/src/StudioVnl.Infrastructure/StudioVnl.Infrastructure.csproj src/StudioVnl.Infrastructure/
COPY apps/api/src/StudioVnl.Api/StudioVnl.Api.csproj src/StudioVnl.Api/
RUN dotnet restore src/StudioVnl.Api/StudioVnl.Api.csproj

COPY apps/api/src/ src/
RUN dotnet publish src/StudioVnl.Api/StudioVnl.Api.csproj -c Release -o /out /p:UseAppHost=false

# --- Run ---------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS run

# FFmpeg pour le transcodage et l'extraction des posters.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://0.0.0.0:5080
EXPOSE 5080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -sf http://localhost:5080/health || exit 1

USER $APP_UID
ENTRYPOINT ["dotnet", "StudioVnl.Api.dll"]
