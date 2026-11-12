import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AdminApiService } from '../../core/api/admin-api.service';
import { UploadService, validateFile } from '../../core/api/upload.service';
import { MediaAsset, MediaKind } from '../../models';

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

      @if (current(); as asset) {
        <div class="picker__current">
          @if (asset.posterUrl; as poster) {
            <img class="picker__thumb" [src]="poster" [alt]="asset.fileName" />
          }
          <div>
            <p class="picker__name">{{ asset.fileName }}</p>
            <p class="a-hint">{{ statusLabel(asset) }}</p>
            @if (asset.processingStatus === 'Pending' || asset.processingStatus === 'Processing') {
              <p class="a-hint">
                Le site affichera ce média dès la fin du traitement (quelques minutes, plus pour un
                long film). Cette page se met à jour toute seule.
              </p>
            }
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
          <input class="sr-only" type="file" [accept]="accept()" (change)="onFileInput($event)" />
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

      @if (choices().length > 0) {
        <details class="picker__more">
          <summary class="a-hint">
            Ou choisir {{ kindLabel() }} déjà envoyé(e) ({{ choices().length }})
          </summary>
          <div class="a-scroll">
            <ul class="picker__library">
              @for (asset of choices(); track asset.id) {
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
                    <span class="a-hint">{{ statusLabel(asset) }}</span>
                  </button>
                </li>
              }
            </ul>
          </div>
        </details>
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

  /** Médias du type attendu seulement : une bande vidéo ne propose pas les photos. */
  protected readonly choices = computed(() => {
    const kind = this.kind();
    return kind ? this.library().filter((asset) => asset.kind === kind) : this.library();
  });

  /** Média choisi, avec son état de traitement à jour (rafraîchi par la bibliothèque). */
  protected readonly current = computed(() => {
    const selected = this.selected();
    return selected ? (this.library().find((asset) => asset.id === selected.id) ?? selected) : null;
  });

  protected readonly kindLabel = computed(() =>
    this.kind() === 'Video' ? 'une vidéo' : this.kind() === 'Image' ? 'une image' : 'un média',
  );

  private readonly kind = computed<MediaKind | null>(() => {
    const accept = this.accept();
    if (accept.startsWith('video/') && !accept.includes('image/')) {
      return 'Video';
    }
    if (accept.startsWith('image/') && !accept.includes('video/')) {
      return 'Image';
    }
    return null;
  });

  constructor() {
    this.refresh();
    // Tant qu'un média est en traitement, l'état est relu toutes les 10 s.
    const timer = setInterval(() => {
      if (
        this.library().some(
          (a) => a.processingStatus === 'Pending' || a.processingStatus === 'Processing',
        )
      ) {
        this.refresh();
      }
    }, 10_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
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
        return 'Traitement en cours…';
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
