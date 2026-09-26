import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { CategoryKey, SITE_LOCALE, categoryPath, categorySlug, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { CATEGORY_NAMES } from '../../core/site-content';
import { PACK_LABELS, PRICING, VAT_LABELS, formatPrice, startingPrice } from '../../core/packs';

/**
 * Tarifs sur la home : une carte par catégorie avec son prix d'appel et le
 * lien vers ses formules. Remplace les quatre anciennes cartes saisies à la
 * main : les prix viennent de `PRICING`, la même grille que la page tarifs
 * et les pages catégorie — un seul endroit porte les prix du site.
 */
@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RevealDirective, RouterLink],
  template: `
    <section class="services" id="prestations" aria-labelledby="titre-prestations">
      <app-section-title
        [eyebrow]="text.services.eyebrow"
        [title]="text.services.title"
        titleId="titre-prestations"
      />
      <p class="services__lead">{{ text.services.lead }}</p>
      <div class="services__grid">
        @for (entry of pricing; track entry.key) {
          <article class="card" appReveal>
            <h3 class="card__name">{{ name(entry.key) }}</h3>
            <ul class="card__included">
              @for (pack of entry.packs; track pack.type) {
                <li class="card__item">
                  {{ packLabel(pack.type) }}
                  @if (pack.price !== null) {
                    <span class="card__item-price">{{ format(pack.price) }}</span>
                  }
                </li>
              }
            </ul>
            <p class="card__price">{{ text.services.from }} {{ format(from(entry.key)) }} {{ vat(entry.vat) }}</p>
            <a class="card__cta" [routerLink]="categoryHref(entry.key)">{{ text.services.cta }} →</a>
          </article>
        }
      </div>
      <p class="services__all">
        <a [routerLink]="pricingPath">{{ text.services.allPricing }} →</a>
      </p>
    </section>
  `,
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];
  protected readonly pricing = PRICING;
  protected readonly pricingPath = routePath(this.locale, 'pricing');

  protected name(key: CategoryKey): string {
    return CATEGORY_NAMES[key][this.locale];
  }

  protected packLabel(type: (typeof PRICING)[number]['packs'][number]['type']): string {
    return PACK_LABELS[type][this.locale];
  }

  protected vat(mode: (typeof PRICING)[number]['vat']): string {
    return VAT_LABELS[mode][this.locale];
  }

  protected from(key: CategoryKey): number {
    return startingPrice(key);
  }

  protected format(amount: number): string {
    return formatPrice(amount);
  }

  protected categoryHref(key: CategoryKey): string {
    return categoryPath(this.locale, categorySlug(this.locale, key));
  }
}
