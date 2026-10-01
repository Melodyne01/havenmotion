import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryKey, SITE_LOCALE, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import {
  CategoryPricing,
  PACK_LABELS,
  Pack,
  VAT_LABELS,
  comboSaving,
  formatPrice,
  pricingFor,
} from '../../core/packs';
import { optionsFor } from '../../core/pricing-options';

/**
 * Grille des quatre formules d'une catégorie (photo, vidéo, photo + vidéo,
 * sur mesure), avec le régime de TVA à côté de chaque prix et l'économie du
 * combo mise en avant. Même composant sur la page catégorie et sur la page
 * tarifs : une seule présentation des prix sur tout le site.
 *
 * Chaque bouton « Choisir » renvoie au formulaire de devis avec la
 * catégorie et la formule préremplies (`?categorie=…&formule=…`), pour que
 * la demande arrive déjà qualifiée dans le backoffice.
 */
@Component({
  selector: 'app-pack-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="packs" [class.packs--compact]="compact()">
      @for (pack of pricing().packs; track pack.type) {
        <article class="pack" [class.pack--combo]="pack.type === 'combo'">
          <h3 class="pack__name">{{ label(pack) }}</h3>
          <p class="pack__price">
            @if (pack.price === null) {
              <span class="pack__amount">{{ text.packs.onQuote }}</span>
            } @else {
              <span class="pack__from">{{ text.packs.from }}</span>
              <span class="pack__amount">{{ format(pack.price) }}</span>
              <span class="pack__vat">{{ vatLabel() }}</span>
            }
          </p>
          @if (pack.type === 'combo' && saving() > 0) {
            <p class="pack__saving">− {{ format(saving()) }} {{ text.packs.saving }}</p>
          }
          <dl class="pack__facts">
            <dt>{{ text.packs.duration }}</dt>
            <dd>{{ pack.duration[locale] }}</dd>
            <dt>{{ text.packs.deliverables }}</dt>
            <dd>{{ pack.deliverables[locale] }}</dd>
          </dl>
          <ul class="pack__included" [attr.aria-label]="text.packs.included">
            @for (item of pack.included[locale]; track item) {
              <li class="pack__item">{{ item }}</li>
            }
          </ul>
          <a
            class="pack__cta"
            [routerLink]="contactPath"
            [queryParams]="{ categorie: pricing().key, formule: pack.type }"
            >{{ text.packs.choose }}</a
          >
        </article>
      }
    </div>

    @if (showOptions()) {
      <h3 class="options__title">{{ text.packs.optionsTitle }}</h3>
      <dl class="options">
        @for (option of options(); track option.id) {
          <div class="options__item">
            <dt class="options__name">
              {{ option.name[locale] }}
              <span class="options__price">{{ option.from ? text.packs.from + ' ' : '' }}{{ format(option.price) }}</span>
            </dt>
            <dd class="options__desc">{{ option.description[locale] }}</dd>
          </div>
        }
      </dl>
    }

    <p class="packs__note">
      {{ text.packs.travelNote }}
      <a [routerLink]="pricingPath">{{ text.packs.allPricing }} →</a>
    </p>
  `,
  styles: [
    `
      @use 'tokens' as *;

      :host {
        display: block;
        width: 100%;
      }

      .packs {
        display: grid;
        gap: $gutter;

        @include tablet-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @include desktop {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      .pack {
        display: grid;
        align-content: start;
        gap: 14px;
        padding: 24px 20px 28px;
        background: $color-charcoal;
        border: $rule-width solid $color-rule-10;
      }

      .pack--combo {
        border-color: $color-amber;
      }

      .pack__name {
        @include display-caps($fs-18, $ls-14);

        color: $color-film;
        margin: 0;
      }

      .pack__price {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 6px;
        margin: 0;
      }

      .pack__from,
      .pack__vat {
        @include display-caps($fs-11, $ls-20, $weight-semibold);

        color: $color-muted-45;
      }

      .pack__amount {
        @include display-caps($fs-26, $ls-10);

        color: $color-amber;
      }

      .pack__saving {
        margin: -6px 0 0;
        color: $color-amber;
        font-size: $fs-13;
      }

      .pack__facts {
        display: grid;
        gap: 4px;
        margin: 0;
        padding-top: 12px;
        border-top: $rule-width solid $color-rule-10;

        dt {
          @include display-caps($fs-11, $ls-20, $weight-semibold);

          color: $color-muted-45;
        }

        dd {
          margin: 0 0 6px;
          color: $color-film;
          font-size: $fs-13;
          line-height: $lh-body;
        }
      }

      .pack__included {
        display: grid;
        gap: 6px;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .pack__item {
        position: relative;
        padding-left: 16px;
        color: $color-muted-60;
        font-size: $fs-13;
        line-height: $lh-body;

        &::before {
          position: absolute;
          left: 0;
          color: $color-amber;
          content: '—';
        }
      }

      .pack__cta {
        @include display-caps($fs-11, $ls-20, $weight-bold);

        justify-self: start;
        margin-top: 6px;
        padding: 12px 18px;
        color: $color-amber;
        text-decoration: none;
        border: $rule-width solid $color-rule-16;
        transition: border-color $dur-fast $ease;

        &:hover {
          border-color: $color-amber;
        }
      }

      .pack--combo .pack__cta {
        background: $color-amber;
        color: $color-charcoal;
        border-color: $color-amber;
      }

      .options__title {
        @include display-caps($fs-15, $ls-14, $weight-semibold);

        color: $color-film;
        margin: 32px 0 0;
      }

      .options {
        display: grid;
        gap: 0;
        margin: 12px 0 0;
        border-top: $rule-width solid $color-rule-10;

        @include tablet-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 32px;
        }
      }

      .options__item {
        padding: 14px 0;
        border-bottom: $rule-width solid $color-rule-10;
      }

      .options__name {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: $color-film;
        font-size: $fs-14;
        font-weight: $weight-semibold;
      }

      .options__price {
        color: $color-amber;
        white-space: nowrap;
      }

      .options__desc {
        margin: 4px 0 0;
        color: $color-muted-60;
        font-size: $fs-13;
        line-height: $lh-body;
      }

      .packs__note {
        margin: 20px 0 0;
        color: $color-muted-60;
        font-size: $fs-13;
        line-height: $lh-body;

        a {
          color: $color-amber;
          text-decoration: none;
        }
      }

      .packs--compact {
        @include desktop {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class PackGridComponent {
  readonly category = input.required<CategoryKey>();
  /** Affiche les options à la carte sous la grille (page catégorie). */
  readonly showOptions = input(true);
  readonly compact = input(false);

  protected readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];
  protected readonly contactPath = routePath(this.locale, 'contact');
  protected readonly pricingPath = routePath(this.locale, 'pricing');

  protected readonly pricing = computed<CategoryPricing>(() => pricingFor(this.category()));
  protected readonly saving = computed(() => comboSaving(this.pricing()));
  protected readonly options = computed(() => optionsFor(this.category()));
  protected readonly vatLabel = computed(() => VAT_LABELS[this.pricing().vat][this.locale]);

  protected label(pack: Pack): string {
    return PACK_LABELS[pack.type][this.locale];
  }

  protected format(amount: number): string {
    return formatPrice(amount);
  }
}
