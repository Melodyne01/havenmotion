import { ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, inject, input, signal, viewChild } from '@angular/core';
import { SiteStore } from '../site-store';
import { CategoryKey, SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { CATEGORY_NAMES, COMPANY } from '../../core/site-content';
import { PACK_LABELS, PACK_TYPES, PackType, VAT_LABELS, formatPrice, pricingFor } from '../../core/packs';
import { COUNTRIES, CountryCode, REGIONS, findRegion, regionId } from '../../core/regions';
import { travelZone } from '../../core/travel-zones';
import { CATEGORY_KEYS, QuotePrefill, QuoteService, buildQuoteMessage, mailtoUrl, whatsappUrl } from '../../core/quote';
import { AnalyticsData, AnalyticsService } from '../../core/analytics';

/** Un nom d'événement Umami par étape : le taux de passage se lit dans la vue Events. */
const STEP_EVENTS: Record<number, string> = {
  1: 'quote_step_1_project',
  2: 'quote_step_2_place',
  3: 'quote_step_3_message',
};

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

            <div class="send">
              @if (whatsappHref(); as href) {
                <a class="btn btn--primary btn--whatsapp" [href]="href" target="_blank" rel="noopener" (click)="guardSend($event, 'whatsapp')">
                  <svg class="btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      fill="currentColor"
                      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.06 0 1.21.88 2.38 1 2.55.12.16 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z"
                    />
                  </svg>
                  {{ text.sendWhatsapp }}
                </a>
              }
              <a class="btn" [class.btn--primary]="!whatsappHref()" [href]="mailHref()" (click)="guardSend($event, 'email')">{{
                text.sendEmail
              }}</a>
            </div>

            <div class="nav nav--send">
              <button type="button" class="btn" (click)="go(2)">{{ text.back }}</button>
              <button type="button" class="link" (click)="copy()">{{ copied() ? text.copied : text.copy }}</button>
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
  private readonly analytics = inject(AnalyticsService);
  private readonly quote = inject(QuoteService);

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
    this.applyPrefill();
    this.trackStep(1);
  }

  private applyPrefill(): void {
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
    if (step < this.step()) {
      this.analytics.track('quote_step_back', { from: this.step(), form: this.formKind() });
    }
    this.step.set(step);
    this.trackStep(step);
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
  protected guardSend(event: Event, channel: 'whatsapp' | 'email'): void {
    if (!this.name().trim()) {
      event.preventDefault();
      this.nameError.set(true);
      this.nameInput()?.nativeElement.focus();
      this.analytics.track('quote_name_missing', { channel, form: this.formKind() });
      return;
    }
    // Conversion : le visiteur part vers WhatsApp ou sa messagerie avec le message prêt.
    this.analytics.track(`quote_submit_${channel}`, this.context());
    if (this.inDialog()) {
      this.quote.markSent();
    }
  }

  protected copy(): void {
    this.analytics.track('quote_copy', { form: this.formKind() });
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.message()).then(() => this.copied.set(true));
    }
  }

  // --- Mesure d'audience ------------------------------------------------------

  private trackStep(step: number): void {
    const data: AnalyticsData = { form: this.formKind() };
    if (step >= 2) {
      Object.assign(data, { category: this.category(), pack: this.pack() || 'undecided' });
    }
    if (step >= 3) {
      Object.assign(data, { country: this.country(), region: this.region() || 'undecided', budget: this.budget() });
    }
    this.analytics.track(STEP_EVENTS[step], data);
    if (this.inDialog()) {
      this.quote.stepShown(step);
    }
  }

  /** Tout ce qui qualifie la demande, joint aux conversions. */
  private context(): AnalyticsData {
    return {
      category: this.category(),
      pack: this.pack() || 'undecided',
      country: this.country(),
      region: this.region() || 'undecided',
      budget: this.budget(),
      lang: this.locale,
      form: this.formKind(),
    };
  }

  /** `popup` ou `page` (formulaire de la page Contact). */
  private formKind(): string {
    return this.inDialog() ? 'popup' : 'page';
  }

  private inDialog(): boolean {
    return typeof this.host.nativeElement.closest === 'function' && !!this.host.nativeElement.closest('dialog');
  }
}
