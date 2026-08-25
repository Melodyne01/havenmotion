import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../app-config';
import { MediaAsset } from '../../models';
import { AuthService } from '../auth/auth.service';

/** 5 Mo : compromis entre nombre de requêtes et coût d'une reprise. */
const CHUNK_SIZE = 5 * 1024 * 1024;

export const MAX_VIDEO_BYTES = 4 * 1024 * 1024 * 1024;
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
  return null;
}

/**
 * Upload par morceaux. L'API ouvre une session, reçoit les morceaux dans
 * l'ordre puis assemble le fichier et déclenche le transcodage FFmpeg.
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
          const headers = this.headers();
          const startResponse = await fetch(`${this.base}/admin/media/uploads`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              contentType: file.type,
              sizeBytes: file.size,
              totalChunks: total,
            }),
            signal: controller.signal,
          });
          if (!startResponse.ok) {
            throw new Error(`Ouverture de session refusée (HTTP ${startResponse.status}).`);
          }
          const { uploadId } = (await startResponse.json()) as { uploadId: string };

          for (let index = 0; index < total; index++) {
            const slice = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);
            const body = new FormData();
            body.append('chunk', slice, `${file.name}.part${index}`);
            const chunkResponse = await fetch(
              `${this.base}/admin/media/uploads/${uploadId}/chunks/${index}`,
              { method: 'PUT', headers, body, signal: controller.signal },
            );
            if (!chunkResponse.ok) {
              throw new Error(`Morceau ${index + 1}/${total} refusé.`);
            }
            subscriber.next({ percent: Math.round(((index + 1) / total) * 95) });
          }

          const completeResponse = await fetch(
            `${this.base}/admin/media/uploads/${uploadId}/complete`,
            { method: 'POST', headers, signal: controller.signal },
          );
          if (!completeResponse.ok) {
            throw new Error("L'assemblage du fichier a échoué.");
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

  private headers(): Record<string, string> {
    const token = this.auth.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
