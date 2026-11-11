import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { APP_CONFIG } from '../app-config';
import { MediaAsset } from '../../models';
import { AuthService } from '../auth/auth.service';

/** 5 Mo : compromis entre nombre de requêtes et coût d'une reprise. */
const CHUNK_SIZE = 5 * 1024 * 1024;

export const MAX_VIDEO_BYTES = 4 * 1024 * 1024 * 1024;
/** 100 Mo : aligné sur l'API (`StartUploadValidator.MaxImageSizeBytes`). */
export const MAX_IMAGE_BYTES = 100 * 1024 * 1024;
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-matroska'];
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export interface UploadProgress {
  /** 0 → 100. */
  percent: number;
  /** Renseigné une fois l'assemblage terminé côté API. */
  asset?: MediaAsset;
}

/** Refuse un fichier avant tout envoi ; renvoie `null` si le fichier est valide. */
export function validateFile(file: File): string | null {
  const accepted = [...ACCEPTED_VIDEO_TYPES, ...ACCEPTED_IMAGE_TYPES];
  if (!accepted.includes(file.type)) {
    return `Type non pris en charge : ${file.type || 'inconnu'}.`;
  }
  if (ACCEPTED_VIDEO_TYPES.includes(file.type) && file.size > MAX_VIDEO_BYTES) {
    return 'Fichier trop lourd : 4 Go maximum.';
  }
  if (ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size > MAX_IMAGE_BYTES) {
    return 'Image trop lourde : 100 Mo maximum.';
  }
  return null;
}

/** Message lisible d'une réponse d'erreur de l'API (`title` d'un problem+json, ou première erreur de validation). */
async function problemMessage(response: Response): Promise<string | null> {
  try {
    const body = (await response.json()) as { title?: string; errors?: Record<string, string[]> };
    const firstError = body.errors ? Object.values(body.errors).flat()[0] : undefined;
    return firstError ?? body.title ?? null;
  } catch {
    return null;
  }
}

/**
 * Upload par morceaux. L'API ouvre une session, reçoit les morceaux dans
 * l'ordre puis assemble le fichier : une vidéo part au transcodage FFmpeg,
 * une photo est optimisée tout de suite (ImageSharp).
 */
@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly auth = inject(AuthService);
  private readonly base = inject(APP_CONFIG).apiBaseUrl;

  upload(file: File): Observable<UploadProgress> {
    return new Observable<UploadProgress>((subscriber) => {
      const controller = new AbortController();
      const total = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

      void (async () => {
        try {
          const startResponse = await this.send(
            `${this.base}/admin/media/uploads`,
            () => ({
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: file.name,
                contentType: file.type,
                sizeBytes: file.size,
                totalChunks: total,
              }),
            }),
            controller.signal,
          );
          if (!startResponse.ok) {
            throw new Error(
              (await problemMessage(startResponse)) ??
                `Ouverture de session refusée (HTTP ${startResponse.status}).`,
            );
          }
          const { uploadId } = (await startResponse.json()) as { uploadId: string };

          for (let index = 0; index < total; index++) {
            const slice = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
            const chunkResponse = await this.send(
              `${this.base}/admin/media/uploads/${uploadId}/chunks/${index}`,
              () => {
                const body = new FormData();
                body.append('chunk', slice, `${file.name}.part${index}`);
                return { method: 'PUT', body };
              },
              controller.signal,
            );
            if (!chunkResponse.ok) {
              const reason =
                (await problemMessage(chunkResponse)) ?? `HTTP ${chunkResponse.status}`;
              throw new Error(`Morceau ${index + 1}/${total} refusé : ${reason}.`);
            }
            subscriber.next({ percent: Math.round(((index + 1) / total) * 95) });
          }

          const completeResponse = await this.send(
            `${this.base}/admin/media/uploads/${uploadId}/complete`,
            () => ({ method: 'POST' }),
            controller.signal,
          );
          if (!completeResponse.ok) {
            // 422 : photo refusée par l'optimisation (illisible, démesurée) — l'API dit pourquoi.
            throw new Error(
              (await problemMessage(completeResponse)) ?? "L'assemblage du fichier a échoué.",
            );
          }
          const asset = (await completeResponse.json()) as MediaAsset;
          subscriber.next({ percent: 100, asset });
          subscriber.complete();
        } catch (error) {
          if (!controller.signal.aborted) {
            subscriber.error(error);
          }
        }
      })();

      return () => controller.abort();
    });
  }

  /**
   * Envoie une requête avec le jeton d'accès du moment. Un envoi de vidéo
   * dure souvent plus que la vie du jeton (15 min) : sur un 401, la session
   * est rafraîchie puis la requête rejouée. Les erreurs passagères (réseau,
   * 502/503/504) sont retentées deux fois.
   */
  private async send(url: string, init: () => RequestInit, signal: AbortSignal): Promise<Response> {
    let refreshed = false;
    for (let attempt = 1; ; attempt++) {
      let response: Response;
      try {
        const request = init();
        response = await fetch(url, {
          ...request,
          headers: {
            ...(request.headers as Record<string, string> | undefined),
            ...this.headers(),
          },
          signal,
        });
      } catch (error) {
        if (signal.aborted || attempt >= 3) {
          throw error;
        }
        await delay(1000 * attempt);
        continue;
      }
      if (response.status === 401 && !refreshed) {
        refreshed = true;
        if (await firstValueFrom(this.auth.refresh())) {
          continue;
        }
        throw new Error('Session expirée : reconnectez-vous puis relancez l’envoi.');
      }
      if ([502, 503, 504].includes(response.status) && attempt < 3) {
        await delay(1000 * attempt);
        continue;
      }
      return response;
    }
  }

  private headers(): Record<string, string> {
    const token = this.auth.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
