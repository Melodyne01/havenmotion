import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** En-tête de section : sur-titre ambre en petites capitales + H2. */
@Component({
  selector: 'app-section-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head">
      <p class="head__eyebrow">{{ eyebrow() }}</p>
      <h2 class="head__title" [attr.id]="titleId()">{{ title() }}</h2>
    </header>
  `,
  styles: [
    `
      @use 'tokens' as *;

      .head {
        display: grid;
        gap: 18px;
        margin-bottom: 48px;
      }

      .head__eyebrow {
        @include display-caps($fs-11, $ls-44, $weight-semibold);

        color: $color-amber;
      }

      .head__title {
        @include display-caps($fs-40, $ls-14);

        color: $color-film;

        @include tablet-up {
          font-size: $fs-64;
          line-height: $lh-tight;
        }
      }
    `,
  ],
})
export class SectionTitleComponent {
  readonly eyebrow = input('');
  readonly title = input('');
  readonly titleId = input<string | null>(null);
}
