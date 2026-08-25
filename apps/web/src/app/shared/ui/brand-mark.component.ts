import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marque compacte « VNL » : carré ambre, lettres charbon. Utilisée en
 * watermark vidéo (variante blanc pellicule 40 %) et déclinée en favicon.
 */
@Component({
  selector: 'app-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="mark" [class.mark--watermark]="watermark()" aria-hidden="true">VNL</span>`,
  styles: [
    `
      @use 'tokens' as *;

      .mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        min-width: 34px;
        padding: 0 6px;
        background: $color-amber;
        color: $color-charcoal;
        font-family: $font-display;
        font-weight: $weight-bold;
        font-size: $fs-13;
        letter-spacing: $ls-10;
        line-height: $lh-flat;
        text-transform: uppercase;
      }

      // Watermark sur les vidéos : blanc pellicule à 40 %, sans fond.
      .mark--watermark {
        background: none;
        color: $color-film;
        opacity: 0.4;
      }
    `,
  ],
})
export class BrandMarkComponent {
  readonly watermark = input(false);
}
