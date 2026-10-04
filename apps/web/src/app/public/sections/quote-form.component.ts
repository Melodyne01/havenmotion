import { ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { SiteStore } from '../site-store';
import { CategoryKey, SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { CATEGORY_NAMES, COMPANY } from '../../core/site-content';
import { PACK_LABELS, PACK_TYPES, PackType, VAT_LABELS, formatPrice, pricingFor } from '../../core/packs';
import { COUNTRIES, CountryCode, REGIONS, findRegion, regionId } from '../../core/regions';
import { travelZone } from '../../core/travel-zones';
import { CATEGORY_KEYS, QuotePrefill, buildQuoteMessage, mailtoUrl, whatsappUrl } from '../../core/quote';

/** Valeur « Autre » du type de projet. */
const OTHER = 'autre';

/**
 * Tunnel de devis en trois étapes, sur le modèle du tunnel Beetee : chaque
 * choix est un bouton à cocher (un vrai bouton radio, stylé), jamais une
 * liste déroulante. 1. Projet et formule. 2. Pays, région et budget.
 * 3. Nom, message libre, aperçu du message qui se compose en direct, et
 * envoi par WhatsApp ou e-mail. Rien n'est envoyé au serveur.
 */
@Component({
  selector: 'app-quote-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="funnel">
      <ol class="progress" [attr.aria-label]="text.progressLabel">
        @for (label of text.steps; track $index) {
          <li
            class="progress__item"
            [class.is-active]="step() === $index + 1"
            [class.is-complete]="step() > $index + 1"
            [attr.aria-current]="step() === $index + 1 ? 'step' : null"
          >
            <span class="progress__dot">{{ $index + 1 }}</span>
            <span class="progress__label">{{ label }}</span>
          </li>
        }
      </ol>

      @switch (step()) {
        @case (1) {
          <fieldset class="step">
            <legend class="step__legend">
              <span class="step__count">{{ stepCount(1) }}</span>
              {{ text.stepTitles[0] }}
            </legend>
            <p class="step__copy">{{ text.stepCopies[0] }}</p>

            <div class="group" [class.has-error]="categoryError()">
              <p class="group__label" [id]="id('category-label')">{{ text.projectTypeLabel }}</p>
              <div class="choices" role="radiogroup" [attr.aria-labelledby]="id('category-label')">
                @for (type of projectTypes; track type.value) {
                  <label class="choice">
                    <input
                      type="radio"
                      [name]="id('category')"
                      [value]="type.value"
                      [checked]="category() === type.value"
                      (change)="pickCategory(type.value)"
                    />
                    <span>{{ type.label }}</span>
                  </label>
                }
              </div>
              @if (categoryError()) {
                <p class="group__error" role="alert">{{ text.categoryError }}</p>
              }
            </div>

            <div class="group">
              <p class="group__label" [id]="id('pack-label')">{{ text.packLabel }}</p>
              <div class="choices choices--wide" role="radiogroup" [attr.aria-labelledby]="id('pack-label')">
                @for (option of packOptions(); track option.value) {
                  <label class="choice">
                    <input
                      type="radio"
                      [name]="id('pack')"
                      [value]="option.value"
                      [checked]="pack() === option.value"
                      (change)="pack.set(option.value)"
                    />
                    <span>
                      {{ option.label }}
                      @if (option.price) {
                        <small>{{ option.price }}</small>
                      }
                    </span>
                  </label>
                }
              </div>
            </div>

            <div class="nav">
              <button type="button" class="btn btn--primary" (click)="next()">{{ text.next }}</button>
            </div>
          </fieldset>
        }

        @case (2) {
          <fieldset class="step">
            <legend class="step__legend">
              <span class="step__count">{{ stepCount(2) }}</span>
              {{ text.stepTitles[1] }}
            </legend>
            <p class="step__copy">{{ text.stepCopies[1] }}</p>

            <div class="group">
              <p class="group__label" [id]="id('country-label')">{{ text.countryLabel }}</p>
              <div class="choices" role="radiogroup" [attr.aria-labelledby]="id('country-label')">
                @for (item of countries; track item.code) {
                  <label class="choice">
                    <input
                      type="radio"
                      [name]="id('country')"
                      [value]="item.code"
                      [checked]="country() === item.code"
                      (change)="pickCountry(item.code)"
                    />
                    <span>{{ item.name }}</span>
                  </label>
                }
              </div>
            </div>

            @if (countryRegions().length > 1) {
              <div class="group">
                <p class="group__label" [id]="id('region-label')">{{ text.regionLabel }}</p>
                <div class="choices choices--wide" role="radiogroup" [attr.aria-labelledby]="id('region-label')">
                  @for (item of countryRegions(); track item.id) {
                    <label class="choice">
                      <input
                        type="radio"
                        [name]="id('region')"
                        [value]="item.id"
                        [checked]="region() === item.id"
                        (change)="region.set(item.id)"
                      />
                      <span>{{ item.name }}</span>
                    </label>
                  }
                </div>
              </div>
            }
            @if (travelLine(); as travel) {
              <p class="group__hint" [id]="id('travel-hint')">{{ travel }}</p>
            }

            <div class="group">
              <p class="group__label" [id]="id('budget-label')">{{ text.budgetLabel }}</p>
              <div class="choices" role="radiogroup" [attr.aria-labelledby]="id('budget-label')">
                @for (range of budgetRanges; track range) {
                  <label class="choice">
                    <input
                      type="radio"
                      [name]="id('budget')"
                      [value]="range"
                      [checked]="budget() === range"
                      (change)="budget.set(range)"
                    />
                    <span>{{ range }}</span>
                  </label>
                }
              </div>
            </div>

            <div class="nav">
              <button type="button" class="btn" (click)="go(1)">{{ text.back }}</button>
              <button type="button" class="btn btn--primary" (click)="go(3)">{{ text.next }}</button>
            </div>
          </fieldset>
        }

        @case (3) {
          <fieldset class="step">
            <legend class="step__legend">
              <span class="step__count">{{ stepCount(3) }}</span>
              {{ text.stepTitles[2] }}
            </legend>
            <p class="step__copy">{{ text.stepCopies[2] }}</p>

            <div class="group" [class.has-error]="nameError()">
              <label class="group__label" [for]="id('name')">{{ text.nameLabel }}</label>
              <input
                #nameInput
                [id]="id('name')"
                class="input"
                type="text"
                maxlength="120"
                autocomplete="name"
                [value]="name()"
                (input)="typeName($event)"
                [attr.aria-invalid]="nameError() ? 'true' : null"
                [attr.aria-describedby]="nameError() ? id('name-error') : null"
              />
              @if (nameError()) {
                <p class="group__error" [id]="id('name-error')" role="alert">{{ text.nameError }}</p>
              }
            </div>

            <div class="group">
              <label class="group__label" [for]="id('message')">{{ text.messageLabel }}</label>
              <textarea
                [id]="id('message')"
                class="input input--area"
                rows="3"
                maxlength="2000"
                [value]="details()"
                (input)="details.set(value($event))"
              ></textarea>
            </div>

            <div class="group">
              <p class="group__label">{{ text.previewLabel }}</p>
              <blockquote class="preview" [id]="id('preview')" aria-live="polite">{{ message() }}</blockquote>
              <p class="group__hint group__hint--muted">{{ text.previewHint }}</p>
            </div>

            <div class="nav nav--send">
              <button type="button" class="btn" (click)="go(2)">{{ text.back }}</button>
              <button type="button" class="link" (click)="copy()">{{ copied() ? text.copied : text.copy }}</button>
              <a class="btn" [class.btn--primary]="!whatsappHref()" [href]="mailHref()" (click)="guardSend($event)">{{
                text.sendEmail
              }}</a>
              @if (whatsappHref(); as href) {
                <a class="btn btn--primary" [href]="href" target="_blank" rel="noopener" (click)="guardSend($event)">{{
                  text.sendWhatsapp
                }}</a>
              }
            </div>
          </fieldset>
        }
      }
    </div>
  `,
  styleUrl: './quote-form.component.scss',
})
export class QuoteFormComponent implements OnInit {
  /** Valeurs préremplies (catégorie, formule, région) lues dans le lien cliqué. */
  readonly prefill = input<QuotePrefill>({});
  /** Préfixe des identifiants : le popup et la page Contact ne se marchent pas dessus. */
  readonly idPrefix = input('quote');

  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale].contact;
  protected readonly budgetRanges = this.text.budgetRanges;
  protected readonly projectTypes: readonly { value: string; label: string }[] = [
    ...CATEGORY_KEYS.map((key) => ({ value: key as string, label: CATEGORY_NAMES[key][this.locale] })),
    { value: OTHER, label: this.text.otherProjectType },
  ];
  protected readonly countries = COUNTRIES.map((c) => ({ code: c.code, name: c.name[this.locale] }));

  protected readonly step = signal(1);
  protected readonly category = signal<string | null>(null);
  protected readonly pack = signal<string>('');
  protected readonly country = signal<CountryCode | null>(null);
  protected readonly region = signal<string>('');
  protected readonly budget = signal(this.budgetRanges[this.budgetRanges.length - 1]);
  protected readonly name = signal('');
  protected readonly details = signal('');
  protected readonly copied = signal(false);
  protected readonly categoryError = signal(false);
  protected readonly nameError = signal(false);

  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Formules, avec le prix de départ de la catégorie choisie ; « Je ne sais pas encore » en premier. */
  protected readonly packOptions = computed(() => {
    const key = this.categoryKey();
    const pricing = key ? pricingFor(key) : null;
    return [
      { value: '', label: this.text.packUndecided, price: '' },
      ...PACK_TYPES.map((type) => {
        const price = pricing?.packs.find((p) => p.type === type)?.price;
        return {
          value: type as string,
          label: PACK_LABELS[type][this.locale],
          price: price && pricing ? `${formatPrice(price)} ${VAT_LABELS[pricing.vat][this.locale]}` : '',
        };
      }),
    ];
  });

  protected readonly countryRegions = computed(() =>
    REGIONS.filter((r) => r.country === this.country()).map((r) => ({ id: regionId(r), name: r.name[this.locale] })),
  );

  protected readonly travelLine = computed(() => {
    const region = findRegion(this.region());
    if (!region) {
      return '';
    }
    const fee = travelZone(region.zone).fee;
    const value = fee === null ? this.text.travelOnQuote : fee === 0 ? this.text.travelIncluded : formatPrice(fee);
    return `${this.text.travelLabel} : ${value}`;
  });

  /** Message composé en direct, à partir de tous les choix. */
  protected readonly message = computed(() =>
    buildQuoteMessage(this.locale, this.store.settings().brandName, {
      name: this.name().trim() || this.text.namePlaceholder,
      category: this.categoryKey(),
      pack: (this.pack() || null) as PackType | null,
      region: this.region() || null,
      budget: this.budget(),
      message: this.details(),
    }),
  );

  protected readonly whatsappHref = computed(() => (COMPANY.whatsapp ? whatsappUrl(COMPANY.whatsapp, this.message()) : null));

  protected readonly mailHref = computed(() =>
    mailtoUrl(this.store.settings().email, `${this.text.emailSubject} — ${this.name().trim()}`, this.message()),
  );

  private readonly categoryKey = computed(() => {
    const value = this.category();
    return value && value !== OTHER ? (value as CategoryKey) : null;
  });

  ngOnInit(): void {
    const { category, pack, region } = this.prefill();
    if (category) {
      this.category.set(category);
    }
    if (pack) {
      this.pack.set(pack);
    }
    const found = region ? findRegion(region) : null;
    if (found) {
      this.country.set(found.country);
      this.region.set(region!);
    }
  }

  protected id(name: string): string {
    return `${this.idPrefix()}-${name}`;
  }

  protected stepCount(current: number): string {
    return this.text.stepCount.replace('{current}', String(current)).replace('{total}', '3');
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  protected pickCategory(value: string): void {
    this.category.set(value);
    this.categoryError.set(false);
  }

  /** Un pays à une seule région (Luxembourg, étranger) la sélectionne d'office. */
  protected pickCountry(code: CountryCode): void {
    this.country.set(code);
    const regions = REGIONS.filter((r) => r.country === code);
    this.region.set(regions.length === 1 ? regionId(regions[0]) : '');
  }

  protected next(): void {
    if (!this.category()) {
      this.categoryError.set(true);
      return;
    }
    this.go(2);
  }

  /** Change d'étape et remonte en haut : sinon la nouvelle étape s'ouvre défilée vers le bas. */
  protected go(step: number): void {
    this.step.set(step);
    const element = this.host.nativeElement;
    const dialog = element.closest('dialog');
    if (dialog) {
      dialog.scrollTop = 0;
    } else if (typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({ block: 'start' });
    }
  }

  protected typeName(event: Event): void {
    this.name.set(this.value(event));
    if (this.name().trim()) {
      this.nameError.set(false);
    }
    this.copied.set(false);
  }

  /** Les liens d'envoi ne partent pas sans nom : le studio doit savoir à qui il répond. */
  protected guardSend(event: Event): void {
    if (!this.name().trim()) {
      event.preventDefault();
      this.nameError.set(true);
      this.nameInput()?.nativeElement.focus();
    }
  }

  protected copy(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.message()).then(() => this.copied.set(true));
    }
  }
}
