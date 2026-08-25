import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { AdminApiService } from '../../core/api/admin-api.service';
import { UploadService, validateFile } from '../../core/api/upload.service';
import { MediaAsset } from '../../models';

/**
 * Sélecteur de média : liste la bibliothèque et accepte un dépôt de fichier.
 * L'upload est chunké et suivi par une barre de progression.
 */
@Component({
  selector: 'app-media-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="picker">
      <p class="a-label">{{ label() }}</p>

      @if (selected(); as asset) {
        <div class="picker__current">
          @if (asset.posterUrl; as poster) {
            <img class="picker__thumb" [src]="poster" [alt]="asset.fileName" />
          }
          <div>
            <p class="picker__name">{{ asset.fileName }}</p>
            <p class="a-hint">{{ statusLabel(asset) }}</p>
          </div>
        </div>
      }

      <div
        class="picker__drop"
        [class.is-over]="isOver()"
        (dragover)="onDragOver($event)"
        (dragleave)="isOver.set(false)"
        (drop)="onDrop($event)"
      >
        <p class="a-hint">Glissez un fichier ici, ou</p>
        <label class="a-btn a-btn--ghost picker__browse">
          Parcourir
          <input
            class="sr-only"
            type="file"
            [accept]="accept()"
            (change)="onFileInput($event)"
          />
        </label>
      </div>

      @if (progress() !== null) {
        <div class="picker__progress">
          <div class="picker__bar" [style.width.%]="progress()"></div>
        </div>
        <p class="a-status">Envoi {{ progress() }} %</p>
      }

      @if (error()) {
        <p class="a-error" role="alert">{{ error() }}</p>
      }

      @if (library().length > 0) {
        <div class="a-scroll">
          <ul class="picker__library">
            @for (asset of library(); track asset.id) {
              <li>
                <button
                  class="picker__item"
                  type="button"
                  [class.is-active]="asset.id === selected()?.id"
                  (click)="choose.emit(asset)"
                >
                  @if (asset.posterUrl; as poster) {
                    <img class="picker__thumb" [src]="poster" [alt]="asset.fileName" />
                  }
                  <span class="picker__name">{{ asset.fileName }}</span>
                </button>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
  styleUrl: './media-picker.component.scss',
})
export class MediaPickerComponent {
  readonly label = input('Média');
  readonly selected = input<MediaAsset | null>(null);
  readonly accept = input('video/*,image/*');
  readonly choose = output<MediaAsset>();

  private readonly api = inject(AdminApiService);
  private readonly uploads = inject(UploadService);

  protected readonly library = signal<MediaAsset[]>([]);
  protected readonly progress = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly isOver = signal(false);

  constructor() {
    this.refresh();
  }

  protected refresh(): void {
    this.api.media().subscribe({
      next: (assets) => this.library.set(assets),
      error: () => this.library.set([]),
    });
  }

  protected statusLabel(asset: MediaAsset): string {
    switch (asset.processingStatus) {
      case 'Ready':
        return 'Prêt';
      case 'Processing':
        return 'Transcodage en cours…';
      case 'Failed':
        return 'Échec du transcodage';
      default:
        return 'En file d’attente';
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isOver.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.upload(file);
    }
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.upload(file);
    }
    input.value = '';
  }

  private upload(file: File): void {
    const problem = validateFile(file);
    if (problem) {
      this.error.set(problem);
      return;
    }
    this.error.set(null);
    this.progress.set(0);

    this.uploads.upload(file).subscribe({
      next: (state) => {
        this.progress.set(state.percent);
        if (state.asset) {
          this.progress.set(null);
          this.refresh();
          this.choose.emit(state.asset);
        }
      },
      error: (cause: unknown) => {
        this.progress.set(null);
        this.error.set(cause instanceof Error ? cause.message : "L'envoi a échoué.");
      },
    });
  }
}
