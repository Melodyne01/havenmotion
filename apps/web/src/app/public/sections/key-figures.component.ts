import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Bloc de chiffres clés, inspiré d'un pattern repéré chez un concurrent
 * indirect (beetee.be, personnalisation textile — hors secteur, mais le
 * format "gros chiffre + légende courte" transporte bien) : uniquement des
 * faits déjà réels et déjà affichés ailleurs sur le site (catégories, délai
 * de devis, retouches incluses, zone d'intervention mondiale). L'ancien
 * comptage de communes a été retiré de ce bloc sur demande du client : le
 * studio se présente ici d'abord par sa portée internationale, l'ancrage
 * local restant détaillé dans l'intro et le pied de page.
 */
@Component({
  selector: 'app-key-figures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent],
  template: `
    <section class="key-figures" aria-labelledby="titre-chiffres">
      <app-section-title
        [eyebrow]="text.keyFigures.eyebrow"
        [title]="sectionTitle()"
        titleId="titre-chiffres"
      />

      <dl class="key-figures__grid">
        <div class="key-figures__item">
          <dt class="key-figures__value">{{ text.keyFigures.worldwideValue }}</dt>
          <dd class="key-figures__label">{{ text.keyFigures.worldwideLabel }}</dd>
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
      <p class="key-figures__note">{{ text.keyFigures.note }}</p>
    </section>
  `,
  styleUrl: './key-figures.component.scss',
})
export class KeyFiguresComponent {
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];
  protected readonly categories = this.store.categories;

  protected sectionTitle(): string {
    return `${this.store.settings().brandName} ${this.text.keyFigures.titleSuffix}`;
  }
}
