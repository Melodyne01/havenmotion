import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminApiService } from '../../core/api/admin-api.service';
import { MediaPickerComponent } from '../components/media-picker.component';
import { MediaAltEditorComponent } from '../components/media-alt-editor.component';
import { MediaAsset } from '../../models';

/** Bibliothèque de médias : dépôt de fichiers, suivi du transcodage et de l'optimisation des photos. */
@Component({
  selector: 'app-media-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaPickerComponent, MediaAltEditorComponent, DecimalPipe, SlicePipe],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Médias</h1>
        <div class="a-actions">
          @if (unoptimizedImages() > 0) {
            <button class="a-btn" type="button" (click)="reprocessUnoptimized()">
              Optimiser les {{ unoptimizedImages() }} image(s) non optimisée(s)
            </button>
          }
          @if (missingTeasers() > 0) {
            <button class="a-btn" type="button" (click)="reprocessMissing()">
              Retraiter les {{ missingTeasers() }} vidéo(s) sans extrait
            </button>
          }
          <button class="a-btn a-btn--ghost" type="button" (click)="load()">Rafraîchir</button>
        </div>
      </header>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      <p class="a-hint">
        Une vidéo déposée est transcodée sur le serveur (version web, version muette, extrait de 20 s pour la
        lecture automatique, poster). Comptez quelques minutes par film ; « Rafraîchir » met l'état à jour.
        Une photo est optimisée dès la fin de l'envoi : redressée, sans données EXIF ni GPS, déclinée en WebP
        (800, 1600 et 2400 px) pour le site et en JPEG pour le partage sur les réseaux sociaux.
      </p>

      <div class="a-card">
        <app-media-picker label="Ajouter un média" (choose)="load()" />
      </div>

      @if (assets().length === 0) {
        <p class="a-empty">La bibliothèque est vide.</p>
      } @else {
        <div class="a-scroll">
          <table class="a-table">
            <thead>
              <tr>
                <th scope="col">Fichier</th>
                <th scope="col">Type</th>
                <th scope="col">Définition</th>
                <th scope="col">Poids</th>
                <th scope="col">Rendus</th>
                <th scope="col">État</th>
                <th scope="col">Ajouté le</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              @for (asset of assets(); track asset.id) {
                <tr>
                  <td>{{ asset.fileName }}</td>
                  <td>{{ asset.kind === 'Video' ? 'Vidéo' : 'Image' }}</td>
                  <td>{{ asset.width }}×{{ asset.height }}</td>
                  <td>{{ asset.sizeBytes / 1048576 | number: '1.0-1' }} Mo</td>
                  <td>
                    {{ asset.renditions.length }}
                    @if (asset.kind === 'Video' && asset.processingStatus === 'Ready' && !hasTeaser(asset)) {
                      <span class="a-tag a-tag--muted">sans extrait</span>
                    }
                    @if (isUnoptimized(asset)) {
                      <span class="a-tag a-tag--muted">non optimisée</span>
                    }
                  </td>
                  <td>
                    <span class="a-tag" [class.a-tag--muted]="asset.processingStatus !== 'Ready'">
                      {{ statusLabel(asset) }}
                    </span>
                  </td>
                  <td>{{ asset.createdAt | slice: 0 : 10 }}</td>
                  <td>
                    <div class="a-actions">
                      @if (asset.kind === 'Image') {
                        <button
                          class="a-btn a-btn--ghost"
                          type="button"
                          [attr.aria-expanded]="editingAlt() === asset.id"
                          (click)="toggleAlt(asset)"
                        >
                          Texte alternatif
                        </button>
                      }
                      @if (canReprocess(asset)) {
                        <button class="a-btn a-btn--ghost" type="button" (click)="reprocess(asset)">
                          Retraiter
                        </button>
                      }
                      <button class="a-btn a-btn--danger" type="button" (click)="remove(asset)">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
                @if (editingAlt() === asset.id) {
                  <tr>
                    <td colspan="8">
                      <app-media-alt-editor [asset]="asset" (saved)="onAltSaved($event)" />
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
})
export class MediaAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly assets = signal<MediaAsset[]>([]);
  protected readonly status = signal<string | null>(null);
  protected readonly editingAlt = signal<string | null>(null);
  protected readonly unoptimizedImages = computed(() => this.assets().filter((a) => this.isUnoptimized(a)).length);
  protected readonly missingTeasers = computed(
    () =>
      this.assets().filter(
        (a) => a.kind === 'Video' && this.canReprocess(a) && a.processingStatus === 'Ready' && !this.hasTeaser(a),
      ).length,
  );

  constructor() {
    this.load();
  }

  protected statusLabel(asset: MediaAsset): string {
    switch (asset.processingStatus) {
      case 'Ready':
        return 'Prêt';
      case 'Processing':
        return asset.kind === 'Image' ? 'Optimisation' : 'Transcodage';
      case 'Failed':
        return 'Échec';
      default:
        return 'En attente';
    }
  }

  protected load(): void {
    this.api.media().subscribe({
      next: (assets) => this.assets.set(assets),
      error: () => this.assets.set([]),
    });
  }

  protected hasTeaser(asset: MediaAsset): boolean {
    return asset.renditions.some((r) => r.teaser);
  }

  /** Photo servie telle quelle par le serveur : l'AVIF est déjà un format web compact. */
  private isPassThroughImage(asset: MediaAsset): boolean {
    return asset.kind === 'Image' && /\.avif$/i.test(asset.fileName);
  }

  /** Photo déposée avant l'optimisation automatique (ou en échec) : aucune déclinaison web. */
  protected isUnoptimized(asset: MediaAsset): boolean {
    return (
      asset.kind === 'Image' &&
      !this.isPassThroughImage(asset) &&
      (asset.processingStatus === 'Ready' || asset.processingStatus === 'Failed') &&
      !asset.renditions.some((r) => r.type.startsWith('image/'))
    );
  }

  /**
   * Média déposé dans la bibliothèque, hors file de traitement. Les plans
   * d'ambiance provisoires (fichiers du site, sans original) et les AVIF
   * servis tels quels sont exclus.
   */
  protected canReprocess(asset: MediaAsset): boolean {
    return (
      !asset.fileName.endsWith('_AMBIANCE.WEBM') &&
      !this.isPassThroughImage(asset) &&
      (asset.processingStatus === 'Ready' || asset.processingStatus === 'Failed')
    );
  }

  protected toggleAlt(asset: MediaAsset): void {
    this.editingAlt.update((current) => (current === asset.id ? null : asset.id));
  }

  protected onAltSaved(updated: MediaAsset): void {
    this.assets.update((assets) => assets.map((a) => (a.id === updated.id ? updated : a)));
  }

  protected reprocess(asset: MediaAsset): void {
    if (asset.kind === 'Image') {
      this.status.set(`Optimisation de « ${asset.fileName} »…`);
    }
    this.api.reprocessMedia(asset.id).subscribe({
      next: () => {
        this.status.set(
          asset.kind === 'Image'
            ? `« ${asset.fileName} » est optimisée.`
            : `« ${asset.fileName} » repart au transcodage. L'ancienne version reste en ligne en attendant.`,
        );
        this.load();
      },
      error: (cause: unknown) => {
        this.status.set(problemTitle(cause) ?? `Impossible de retraiter « ${asset.fileName} ».`);
        this.load();
      },
    });
  }

  protected reprocessMissing(): void {
    this.api.reprocessMissingTeasers().subscribe({
      next: ({ queued }) => {
        this.status.set(
          `${queued} vidéo(s) en file, traitées l'une après l'autre. Les anciennes versions restent en ligne en attendant.`,
        );
        this.load();
      },
      error: () => this.status.set('Impossible de lancer le retraitement.'),
    });
  }

  protected reprocessUnoptimized(): void {
    this.api.reprocessUnoptimizedImages().subscribe({
      next: ({ queued }) => {
        this.status.set(
          `${queued} image(s) en file d'optimisation. Elles restent en ligne telles quelles en attendant ; « Rafraîchir » met l'état à jour.`,
        );
        this.load();
      },
      error: () => this.status.set("Impossible de lancer l'optimisation."),
    });
  }

  protected remove(asset: MediaAsset): void {
    this.api.deleteMedia(asset.id).subscribe({
      next: () => {
        this.status.set(`« ${asset.fileName} » supprimé.`);
        this.load();
      },
      error: () =>
        this.status.set('Suppression impossible : ce média est peut-être encore utilisé.'),
    });
  }
}

/** Titre d'une réponse d'erreur `application/problem+json` de l'API, s'il y en a un. */
function problemTitle(cause: unknown): string | null {
  if (cause instanceof HttpErrorResponse && typeof cause.error?.title === 'string') {
    return cause.error.title;
  }
  return null;
}
