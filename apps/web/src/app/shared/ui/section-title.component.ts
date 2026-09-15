import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * En-tête de section : sur-titre ambre en petites capitales + titre.
 *
 * Rend un H2 par défaut (usage normal : une section dans une page qui a
 * déjà son propre H1 ailleurs, home incluse). Certaines pages autonomes
 * (à propos, contact, FAQ) réutilisent ce composant comme titre principal
 * de la page — sans H1 propre, la page n'a alors aucun titre de premier
 * niveau. `level="h1"` couvre ce cas sans dupliquer le balisage visuel.
 */
@Component({
  selector: 'app-section-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head">
      <p class="head__eyebrow">{{ eyebrow() }}</p>
      @if (level() === 'h1') {
        <h1 class="head__title" [attr.id]="titleId()">{{ title() }}</h1>
      } @else {
        <h2 class="head__title" [attr.id]="titleId()">{{ title() }}</h2>
      }
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
  readonly level = input<'h1' | 'h2'>('h2');
}
