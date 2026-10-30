import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe, SlicePipe } from '@angular/common';
import { AdminApiService } from '../../core/api/admin-api.service';
import { MediaPickerComponent } from '../components/media-picker.component';
import { MediaAsset } from '../../models';

/** Bibliothèque de médias : dépôt de fichiers et suivi du transcodage. */
@Component({
  selector: 'app-media-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaPickerComponent, DecimalPipe, SlicePipe],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Médias</h1>
        <div class="a-actions">
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
                  </td>
                  <td>
                    <span class="a-tag" [class.a-tag--muted]="asset.processingStatus !== 'Ready'">
                      {{ statusLabel(asset) }}
                    </span>
                  </td>
                  <td>{{ asset.createdAt | slice: 0 : 10 }}</td>
                  <td>
                    <div class="a-actions">
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
  protected readonly missingTeasers = computed(
    () => this.assets().filter((a) => this.canReprocess(a) && a.processingStatus === 'Ready' && !this.hasTeaser(a)).length,
  );

  constructor() {
    this.load();
  }

  protected statusLabel(asset: MediaAsset): string {
    switch (asset.processingStatus) {
      case 'Ready':
        return 'Prêt';
      case 'Processing':
        return 'Transcodage';
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

  /**
   * Vidéo déposée dans la bibliothèque, hors file de transcodage. Les plans
   * d'ambiance provisoires (fichiers du site, sans original) sont exclus.
   */
  protected canReprocess(asset: MediaAsset): boolean {
    return (
      asset.kind === 'Video' &&
      !asset.fileName.endsWith('_AMBIANCE.WEBM') &&
      (asset.processingStatus === 'Ready' || asset.processingStatus === 'Failed')
    );
  }

  protected reprocess(asset: MediaAsset): void {
    this.api.reprocessMedia(asset.id).subscribe({
      next: () => {
        this.status.set(`« ${asset.fileName} » repart au transcodage. L'ancienne version reste en ligne en attendant.`);
        this.load();
      },
      error: () => this.status.set(`Impossible de retraiter « ${asset.fileName} ».`),
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
