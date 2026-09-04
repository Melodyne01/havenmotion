import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { COMMUNES } from '../../core/communes';

/**
 * Bloc de chiffres clés, inspiré d'un pattern repéré chez un concurrent
 * indirect (beetee.be, personnalisation textile — hors secteur, mais le
 * format "gros chiffre + légende courte" transporte bien) : uniquement des
 * faits déjà réels et déjà affichés ailleurs sur le site (nombre de
 * communes, délai de devis du process, retouches incluses), jamais un
 * chiffre inventé pour l'occasion.
 */
@Component({
  selector: 'app-key-figures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent],
  template: `
    <section class="key-figures" aria-labelledby="titre-chiffres">
      <app-section-title
        [eyebrow]="text.keyFigures.eyebrow"
        [title]="text.keyFigures.title"
        titleId="titre-chiffres"
      />

      <dl class="key-figures__grid">
        <div class="key-figures__item">
          <dt class="key-figures__value">{{ communesCount }}</dt>
          <dd class="key-figures__label">{{ text.keyFigures.communes }}</dd>
        </div>
        <div class="key-figures__item">
          <dt class="key-figures__value">{{ categories().length }}</dt>
          <dd class="key-figures__label">{{ text.keyFigures.categoriesLabel }}</dd>
        </div>
        <div class="key-figures__item">
          <dt class="key-figures__value">{{ text.keyFigures.quoteDelayValue }}</dt>
          <dd class="key-figures__label">{{ text.keyFigures.quoteDelayLabel }}</dd>
        </div>
        <div class="key-figures__item">
          <dt class="key-figures__value">{{ text.keyFigures.revisionsValue }}</dt>
          <dd class="key-figures__label">{{ text.keyFigures.revisionsLabel }}</dd>
        </div>
      </dl>
    </section>
  `,
  styleUrl: './key-figures.component.scss',
})
export class KeyFiguresComponent {
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];
  protected readonly categories = this.store.categories;
  protected readonly communesCount = COMMUNES.length;
}
