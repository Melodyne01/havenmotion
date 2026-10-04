import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SiteStore } from '../site-store';
import { CategoryKey, SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { CATEGORY_NAMES, COMPANY } from '../../core/site-content';
import { PACK_LABELS, PACK_TYPES, PackType, formatPrice } from '../../core/packs';
import { COUNTRIES, REGIONS, findRegion, regionId } from '../../core/regions';
import { travelZone } from '../../core/travel-zones';
import { CATEGORY_KEYS, QuotePrefill, buildQuoteMessage, mailtoUrl, whatsappUrl } from '../../core/quote';

/**
 * Formulaire de devis en deux temps. D'abord cinq questions (nom, projet,
 * formule, lieu, budget) et un message libre ; ensuite le message composé,
 * modifiable, avec un bouton WhatsApp et un bouton e-mail qui l'ouvrent
 * prêt à envoyer. Pas de date (décision client) et pas d'e-mail demandé :
 * le visiteur écrit depuis son propre WhatsApp ou sa propre messagerie, le
 * studio a donc déjà de quoi lui répondre. Rien n'est envoyé au serveur.
 */
@Component({
  selector: 'app-quote-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CtaButtonComponent],
  template: `
    @if (message() === null) {
      <form class="form" [formGroup]="form" (ngSubmit)="prepare()" novalidate>
        <div class="form__row form__row--wide">
          <label class="form__label" [for]="id('name')">{{ text.nameLabel }}</label>
          <input
            #nameInput
            [id]="id('name')"
            class="form__input"
            type="text"
            formControlName="name"
            autocomplete="name"
            required
            [attr.aria-invalid]="nameInvalid() ? 'true' : null"
            [attr.aria-describedby]="nameInvalid() ? id('name-error') : null"
          />
          @if (nameInvalid()) {
            <p class="form__error" [id]="id('name-error')">{{ text.nameError }}</p>
          }
        </div>

        <div class="form__row">
          <label class="form__label" [for]="id('category')">{{ text.projectTypeLabel }}</label>
          <select [id]="id('category')" class="form__input" formControlName="category">
            @for (type of projectTypes; track type.value) {
              <option [value]="type.value">{{ type.label }}</option>
            }
          </select>
        </div>

        <div class="form__row">
          <label class="form__label" [for]="id('pack')">{{ text.packLabel }}</label>
          <select [id]="id('pack')" class="form__input" formControlName="pack">
            <option value="">{{ text.packUndecided }}</option>
            @for (pack of packTypes; track pack) {
              <option [value]="pack">{{ packLabel(pack) }}</option>
            }
          </select>
        </div>

        <div class="form__row">
          <label class="form__label" [for]="id('region')">{{ text.regionLabel }}</label>
          <select [id]="id('region')" class="form__input" formControlName="region">
            <option value="">{{ text.regionUndecided }}</option>
            @for (group of regionGroups; track group.code) {
              <optgroup [label]="group.name">
                @for (region of group.regions; track region.id) {
                  <option [value]="region.id">{{ region.name }}</option>
                }
              </optgroup>
            }
          </select>
          @if (travelLine(); as travel) {
            <p class="form__hint" [id]="id('travel-hint')">{{ travel }}</p>
          }
        </div>

        <div class="form__row">
          <label class="form__label" [for]="id('budget')">{{ text.budgetLabel }}</label>
          <select [id]="id('budget')" class="form__input" formControlName="budget">
            @for (range of budgetRanges; track range) {
              <option [value]="range">{{ range }}</option>
            }
          </select>
        </div>

        <div class="form__row form__row--wide">
          <label class="form__label" [for]="id('message')">{{ text.messageLabel }}</label>
          <textarea [id]="id('message')" class="form__input" rows="3" formControlName="message"></textarea>
        </div>

        <div class="form__actions">
          <app-cta-button type="submit">{{ text.submitIdle }}</app-cta-button>
        </div>
      </form>
    } @else {
      <div class="preview">
        <p class="preview__title" role="status">{{ text.previewTitle }}</p>
        <p class="preview__hint">{{ text.previewHint }}</p>
        <label class="sr-only" [for]="id('preview')">{{ text.previewTitle }}</label>
        <textarea
          [id]="id('preview')"
          class="form__input preview__text"
          rows="12"
          [value]="message()"
          (input)="edit($event)"
        ></textarea>

        <div class="preview__actions">
          @if (whatsappHref(); as href) {
            <a class="send send--whatsapp" [href]="href" target="_blank" rel="noopener">{{ text.sendWhatsapp }}</a>
          }
          <a class="send" [class.send--whatsapp]="!whatsappHref()" [href]="mailHref()">{{ text.sendEmail }}</a>
          <button type="button" class="link" (click)="copy()">{{ copied() ? text.copied : text.copy }}</button>
          <button type="button" class="link" (click)="message.set(null)">{{ text.back }}</button>
        </div>
      </div>
    }
  `,
  styleUrl: './quote-form.component.scss',
})
export class QuoteFormComponent implements OnInit {
  /** Valeurs préremplies (catégorie, formule, région) lues dans le lien cliqué. */
  readonly prefill = input<QuotePrefill>({});
  /** Préfixe des identifiants : deux formulaires peuvent coexister sur la page de contact. */
  readonly idPrefix = input('quote');

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale].contact;
  protected readonly packTypes = PACK_TYPES;
  protected readonly budgetRanges = this.text.budgetRanges;
  protected readonly projectTypes: readonly { value: string; label: string }[] = [
    ...CATEGORY_KEYS.map((key) => ({ value: key, label: CATEGORY_NAMES[key][this.locale] })),
    { value: 'autre', label: this.text.otherProjectType },
  ];
  protected readonly regionGroups = COUNTRIES.map((country) => ({
    code: country.code,
    name: country.name[this.locale],
    regions: REGIONS.filter((r) => r.country === country.code).map((r) => ({ id: regionId(r), name: r.name[this.locale] })),
  }));

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    category: [CATEGORY_KEYS[1] as string],
    pack: [''],
    region: [''],
    budget: [this.budgetRanges[this.budgetRanges.length - 1]],
    message: ['', Validators.maxLength(2000)],
  });

  /** Message composé ; `null` tant que le formulaire n'a pas été validé. */
  protected readonly message = signal<string | null>(null);
  protected readonly copied = signal(false);
  private readonly submitted = signal(false);
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  private readonly nameStatus = toSignal(this.form.controls.name.statusChanges, { initialValue: 'INVALID' });
  private readonly regionValue = toSignal(this.form.controls.region.valueChanges, { initialValue: '' });

  protected readonly nameInvalid = computed(() => this.submitted() && this.nameStatus() === 'INVALID');

  protected readonly travelLine = computed(() => {
    const region = findRegion(this.regionValue());
    if (!region) {
      return '';
    }
    const fee = travelZone(region.zone).fee;
    const value = fee === null ? this.text.travelOnQuote : fee === 0 ? this.text.travelIncluded : formatPrice(fee);
    return `${this.text.travelLabel} : ${value}`;
  });

  protected readonly whatsappHref = computed(() => {
    const text = this.message();
    return COMPANY.whatsapp && text ? whatsappUrl(COMPANY.whatsapp, text) : null;
  });

  protected readonly mailHref = computed(() =>
    mailtoUrl(this.store.settings().email, `${this.text.emailSubject} — ${this.form.controls.name.value}`, this.message() ?? ''),
  );

  ngOnInit(): void {
    const { category, pack, region } = this.prefill();
    if (category) {
      this.form.controls.category.setValue(category);
    }
    if (pack) {
      this.form.controls.pack.setValue(pack);
    }
    if (region) {
      this.form.controls.region.setValue(region);
    }
  }

  protected id(name: string): string {
    return `${this.idPrefix()}-${name}`;
  }

  protected packLabel(pack: PackType): string {
    return PACK_LABELS[pack][this.locale];
  }

  protected prepare(): void {
    this.submitted.set(true);
    this.form.controls.name.updateValueAndValidity();
    if (this.form.invalid) {
      this.nameInput()?.nativeElement.focus();
      return;
    }
    const value = this.form.getRawValue();
    this.copied.set(false);
    this.message.set(
      buildQuoteMessage(this.locale, this.store.settings().brandName, {
        name: value.name.trim(),
        category: value.category === 'autre' ? null : (value.category as CategoryKey),
        pack: (value.pack || null) as PackType | null,
        region: value.region || null,
        budget: value.budget,
        message: value.message,
      }),
    );
  }

  protected edit(event: Event): void {
    this.message.set((event.target as HTMLTextAreaElement).value);
    this.copied.set(false);
  }

  protected copy(): void {
    const text = this.message();
    if (text && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => this.copied.set(true));
    }
  }
}
