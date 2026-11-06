import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/api/admin-api.service';
import { MediaAlt, MediaAsset } from '../../models';

const LANGUAGES = [
  { code: 'fr', label: 'FR', placeholder: 'Ex. : Première danse des mariés au château de La Hulpe' },
  { code: 'nl', label: 'NL', placeholder: 'Bv. : Eerste dans van het bruidspaar in het kasteel van Terhulpen' },
  { code: 'en', label: 'EN', placeholder: 'E.g. : The couple’s first dance at the Château de La Hulpe' },
] as const;

/**
 * Texte alternatif d'une image, en trois langues : ce que lit Google Images
 * et ce qu'un lecteur d'écran annonce. Enregistré sur le média, donc repris
 * partout où l'image est utilisée.
 */
@Component({
  selector: 'app-media-alt-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <fieldset class="alt">
      <legend class="a-label">Texte alternatif (décrire la photo en une phrase)</legend>
      @for (lang of languages; track lang.code) {
        <label class="alt__field">
          <span class="alt__lang">{{ lang.label }}</span>
          <input
            class="a-input"
            type="text"
            maxlength="250"
            [placeholder]="lang.placeholder"
            [ngModel]="values()[lang.code]"
            (ngModelChange)="setValue(lang.code, $event)"
            [name]="'alt-' + lang.code + '-' + asset().id"
          />
        </label>
      }
      <div class="alt__actions">
        <button class="a-btn a-btn--ghost" type="button" [disabled]="!dirty() || saving()" (click)="save()">
          Enregistrer le texte
        </button>
        @if (message(); as text) {
          <span class="a-hint" role="status">{{ text }}</span>
        }
      </div>
    </fieldset>
  `,
  styles: [
    `
      .alt {
        display: grid;
        gap: 6px;
        min-width: 0;
        padding: 0;
        margin: 0;
        border: 0;
      }

      .alt__field {
        display: grid;
        grid-template-columns: 2.5em 1fr;
        align-items: center;
        gap: 8px;
      }

      .alt__lang {
        font-size: 12px;
        font-weight: 600;
        opacity: 0.7;
      }

      .alt__actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    `,
  ],
})
export class MediaAltEditorComponent {
  readonly asset = input.required<MediaAsset>();
  readonly saved = output<MediaAsset>();

  private readonly api = inject(AdminApiService);

  protected readonly languages = LANGUAGES;
  protected readonly values = signal<MediaAlt>({ fr: '', nl: '', en: '' });
  protected readonly dirty = signal(false);
  protected readonly saving = signal(false);
  protected readonly message = signal<string | null>(null);

  constructor() {
    effect(() => {
      const alt = this.asset().alt;
      this.values.set({ fr: alt?.fr ?? '', nl: alt?.nl ?? '', en: alt?.en ?? '' });
      this.dirty.set(false);
    });
  }

  protected setValue(code: keyof MediaAlt, value: string): void {
    this.values.update((current) => ({ ...current, [code]: value }));
    this.dirty.set(true);
    this.message.set(null);
  }

  protected save(): void {
    this.saving.set(true);
    this.api.updateMediaAlt(this.asset().id, this.values()).subscribe({
      next: (asset) => {
        this.saving.set(false);
        this.dirty.set(false);
        this.message.set('Enregistré.');
        this.saved.emit(asset);
      },
      error: () => {
        this.saving.set(false);
        this.message.set('Enregistrement impossible.');
      },
    });
  }
}
