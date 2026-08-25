import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CtaVariant = 'solid' | 'ghost';

/** CTA unique du site. `href` produit un lien, sinon un bouton. */
@Component({
  selector: 'app-cta-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  // Le libellé est projeté une seule fois dans `label`, puis rendu par l'une
  // ou l'autre branche : deux `<ng-content>` ne recevraient pas le contenu.
  template: `
    <ng-template #label><ng-content /></ng-template>

    @if (href(); as target) {
      <a class="cta" [class.cta--ghost]="variant() === 'ghost'" [href]="target">
        <ng-container [ngTemplateOutlet]="label" />
      </a>
    } @else {
      <button
        class="cta"
        [class.cta--ghost]="variant() === 'ghost'"
        [type]="type()"
        [disabled]="disabled()"
      >
        <ng-container [ngTemplateOutlet]="label" />
      </button>
    }
  `,
  styles: [
    `
      @use 'tokens' as *;

      :host {
        display: inline-block;
      }

      .cta {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 16px 26px;
        background: $color-amber;
        // Charbon sur ambre : contraste 8.6:1, conforme AA.
        color: $color-charcoal;
        font-family: $font-display;
        font-weight: $weight-bold;
        font-size: $fs-13;
        letter-spacing: $ls-20;
        line-height: $lh-flat;
        text-transform: uppercase;
        border: $rule-width solid $color-amber;
        transition: opacity $dur-fast $ease;

        &:hover {
          opacity: 0.85;
        }

        &:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      }

      .cta--ghost {
        background: none;
        color: $color-amber;
        border-color: $color-rule-16;

        &:hover {
          border-color: $color-amber;
          opacity: 1;
        }
      }
    `,
  ],
})
export class CtaButtonComponent {
  readonly href = input<string | null>(null);
  readonly variant = input<CtaVariant>('solid');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}
