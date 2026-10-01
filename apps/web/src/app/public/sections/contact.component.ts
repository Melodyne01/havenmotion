import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { PublicApiService } from '../../core/api/public-api.service';
import { SiteStore } from '../site-store';
import { CategoryKey, SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { CATEGORY_NAMES } from '../../core/site-content';
import { PACK_LABELS, PACK_TYPES, PackType, formatPrice } from '../../core/packs';
import { COUNTRIES, REGIONS, Region, findRegion, regionId } from '../../core/regions';
import { travelZone } from '../../core/travel-zones';

const CATEGORY_KEYS: readonly CategoryKey[] = ['evenementiel', 'mariage', 'corporate', 'sport', 'clip', 'lifestyle'];

/**
 * Demande de devis. Formulaire court : nom, type de projet, formule,
 * région, date, budget, e-mail obligatoire, message optionnel.
 *
 * La formule et la région sont nouvelles : elles qualifient la demande
 * (pack choisi, forfait de déplacement calculé et affiché avant l'envoi)
 * pour que le devis parte déjà à moitié fait. Les deux arrivent aussi
 * préremplies depuis la grille tarifaire (`?categorie=…&formule=…`).
 *
 * Anti-spam : champ pot de miel invisible (`website`) et limitation de
 * débit côté API. Aucun captcha tiers, donc aucun transfert de données
 * personnelles.
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SectionTitleComponent, CtaButtonComponent],
  template: `
    <section class="contact" id="contact" aria-labelledby="titre-contact">
      <div class="contact__intro">
        <app-section-title
          [eyebrow]="text.eyebrow"
          [title]="text.title"
          titleId="titre-contact"
          [level]="headingLevel()"
        />
        <p class="contact__lead">
          {{ text.lead }}
        </p>
        <ul class="contact__links">
          <li><a class="contact__link" [href]="'mailto:' + settings().email">{{ settings().email }}</a></li>
          <li>
            <a
              class="contact__link"
              [href]="'https://instagram.com/' + instagramHandle()"
              rel="noopener"
              target="_blank"
              >{{ settings().instagram }}</a
            >
          </li>
        </ul>
      </div>

      @if (sent()) {
        <p class="contact__done" role="status">
          {{ text.successMessage }}
        </p>
      } @else {
        <form class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form__row">
            <label class="form__label" for="name">{{ text.nameLabel }}</label>
            <input
              #nameInput
              id="name"
              class="form__input"
              type="text"
              formControlName="name"
              autocomplete="name"
              required
              [attr.aria-invalid]="showError('name') ? 'true' : null"
              [attr.aria-describedby]="showError('name') ? 'name-error' : null"
            />
            @if (showError('name')) {
              <p class="form__error" id="name-error">{{ text.nameError }}</p>
            }
          </div>

          <div class="form__row">
            <label class="form__label" for="email">{{ text.emailLabel }}</label>
            <input
              #emailInput
              id="email"
              class="form__input"
              type="email"
              formControlName="email"
              autocomplete="email"
              required
              [attr.aria-invalid]="showError('email') ? 'true' : null"
              [attr.aria-describedby]="showError('email') ? 'email-error' : null"
            />
            @if (showError('email')) {
              <p class="form__error" id="email-error">{{ text.emailError }}</p>
            }
          </div>

          <div class="form__row">
            <label class="form__label" for="projectType">{{ text.projectTypeLabel }}</label>
            <select id="projectType" class="form__input" formControlName="projectType" required>
              @for (type of projectTypes; track type.value) {
                <option [value]="type.value">{{ type.label }}</option>
              }
            </select>
          </div>

          <div class="form__row">
            <label class="form__label" for="pack">{{ text.packLabel }}</label>
            <select id="pack" class="form__input" formControlName="pack">
              <option value="">{{ text.packUndecided }}</option>
              @for (pack of packTypes; track pack) {
                <option [value]="pack">{{ packLabel(pack) }}</option>
              }
            </select>
          </div>

          <div class="form__row">
            <label class="form__label" for="region">{{ text.regionLabel }}</label>
            <select id="region" class="form__input" formControlName="region">
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
              <p class="form__hint" id="travel-hint">{{ travel }}</p>
            }
          </div>

          <div class="form__row">
            <label class="form__label" for="eventDate">{{ text.dateLabel }}</label>
            <input id="eventDate" class="form__input" type="date" formControlName="eventDate" />
          </div>

          <div class="form__row">
            <label class="form__label" for="budgetRange">{{ text.budgetLabel }}</label>
            <select id="budgetRange" class="form__input" formControlName="budgetRange" required>
              @for (range of budgetRanges; track range) {
                <option [value]="range">{{ range }}</option>
              }
            </select>
          </div>

          <div class="form__row form__row--wide">
            <label class="form__label" for="message">{{ text.messageLabel }}</label>
            <textarea id="message" class="form__input" rows="4" formControlName="message"></textarea>
          </div>

          <!-- Pot de miel : masqué aux humains, rempli par les robots. -->
          <div class="form__honeypot" aria-hidden="true">
            <label for="website">{{ text.honeypotLabel }}</label>
            <input id="website" type="text" formControlName="website" tabindex="-1" autocomplete="off" />
          </div>

          @if (error()) {
            <p class="form__error form__error--global" role="alert">{{ error() }}</p>
          }

          <div class="form__actions">
            <app-cta-button type="submit" [disabled]="pending()">
              {{ pending() ? text.submitPending : text.submitIdle }}
            </app-cta-button>
          </div>
        </form>
      }
    </section>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly headingLevel = input<'h1' | 'h2'>('h2');

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PublicApiService);
  private readonly store = inject(SiteStore);
  private readonly route = inject(ActivatedRoute);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly settings = this.store.settings;
  protected readonly text = UI_TEXT[this.locale].contact;

  /**
   * Le type de projet stocké est le libellé de la catégorie dans la langue
   * du visiteur (comme avant l'ajout des packs) : le backoffice filtre sur
   * ce texte. La formule et la région, elles, sont stockées sous un code
   * neutre (`combo`, `brabant-wallon`) : le backoffice les relit dans sa
   * propre langue.
   */
  protected readonly projectTypes: readonly { value: string; label: string; key: CategoryKey | null }[] = [
    ...CATEGORY_KEYS.map((key) => ({ value: CATEGORY_NAMES[key][this.locale], label: CATEGORY_NAMES[key][this.locale], key })),
    { value: this.text.otherProjectType, label: this.text.otherProjectType, key: null },
  ];
  protected readonly packTypes = PACK_TYPES;
  protected readonly budgetRanges = this.text.budgetRanges;
  protected readonly regionGroups = COUNTRIES.map((country) => ({
    code: country.code,
    name: country.name[this.locale],
    regions: REGIONS.filter((r) => r.country === country.code).map((r) => ({
      id: regionId(r),
      name: r.name[this.locale],
    })),
  }));

  protected readonly sent = signal(false);
  protected readonly pending = signal(false);
  protected readonly error = signal<string | null>(null);

  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  private readonly emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
    projectType: [this.projectTypes[0].value, Validators.required],
    pack: [''],
    region: [''],
    eventDate: [''],
    budgetRange: [this.budgetRanges[4], Validators.required],
    message: ['', Validators.maxLength(2000)],
    website: [''],
  });

  private readonly regionValue = toSignal(this.form.controls.region.valueChanges, { initialValue: '' });

  /** « Déplacement : inclus » / « 90 € » / « sur devis », dès qu'une région est choisie. */
  protected readonly travelLine = computed(() => {
    const region: Region | null = findRegion(this.regionValue());
    if (!region) {
      return '';
    }
    const fee = travelZone(region.zone).fee;
    const value = fee === null ? this.text.travelOnQuote : fee === 0 ? this.text.travelIncluded : formatPrice(fee);
    return `${this.text.travelLabel} : ${value}`;
  });

  constructor() {
    // Préremplissage depuis la grille tarifaire : `?categorie=mariage&formule=combo`.
    const params = this.route.snapshot.queryParamMap;
    const categorie = params.get('categorie') as CategoryKey | null;
    const formule = params.get('formule') as PackType | null;
    const type = this.projectTypes.find((t) => t.key === categorie);
    if (type) {
      this.form.controls.projectType.setValue(type.value);
    }
    if (formule && PACK_TYPES.includes(formule)) {
      this.form.controls.pack.setValue(formule);
    }
  }

  protected packLabel(pack: PackType): string {
    return PACK_LABELS[pack][this.locale];
  }

  protected instagramHandle(): string {
    return this.settings().instagram.replace('@', '');
  }

  protected showError(control: 'name' | 'email'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.touched || field.dirty);
  }

  protected submit(): void {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Déplace le focus sur le premier champ en erreur : sans ça, un
      // utilisateur de lecteur d'écran n'a aucune indication que la
      // soumission a échoué ni où corriger.
      if (this.form.controls.name.invalid) {
        this.nameInput()?.nativeElement.focus();
      } else if (this.form.controls.email.invalid) {
        this.emailInput()?.nativeElement.focus();
      }
      return;
    }

    const value = this.form.getRawValue();
    this.pending.set(true);
    this.api
      .submitLead({ ...value, eventDate: value.eventDate || null, locale: this.locale })
      .subscribe({
        next: () => {
          this.pending.set(false);
          this.sent.set(true);
        },
        error: () => {
          this.pending.set(false);
          this.error.set(this.text.genericError);
        },
      });
  }
}
