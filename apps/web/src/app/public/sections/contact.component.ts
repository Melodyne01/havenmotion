import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { PublicApiService } from '../../core/api/public-api.service';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Demande de devis. Formulaire court : nom, type de projet, date, budget,
 * e-mail obligatoire, message optionnel.
 *
 * Anti-spam : champ pot de miel invisible (`website`) et horodatage minimal
 * côté API. Aucun captcha tiers, donc aucun transfert de données personnelles.
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SectionTitleComponent, CtaButtonComponent],
  template: `
    <section class="contact" id="contact" aria-labelledby="titre-contact">
      <div class="contact__intro">
        <app-section-title [eyebrow]="text.eyebrow" [title]="text.title" titleId="titre-contact" />
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
            <input id="name" class="form__input" type="text" formControlName="name" autocomplete="name" />
            @if (showError('name')) {
              <p class="form__error">{{ text.nameError }}</p>
            }
          </div>

          <div class="form__row">
            <label class="form__label" for="email">{{ text.emailLabel }}</label>
            <input
              id="email"
              class="form__input"
              type="email"
              formControlName="email"
              autocomplete="email"
            />
            @if (showError('email')) {
              <p class="form__error">{{ text.emailError }}</p>
            }
          </div>

          <div class="form__row">
            <label class="form__label" for="projectType">{{ text.projectTypeLabel }}</label>
            <select id="projectType" class="form__input" formControlName="projectType">
              @for (type of projectTypes; track type) {
                <option [value]="type">{{ type }}</option>
              }
            </select>
          </div>

          <div class="form__row">
            <label class="form__label" for="eventDate">{{ text.dateLabel }}</label>
            <input id="eventDate" class="form__input" type="date" formControlName="eventDate" />
          </div>

          <div class="form__row">
            <label class="form__label" for="budgetRange">{{ text.budgetLabel }}</label>
            <select id="budgetRange" class="form__input" formControlName="budgetRange">
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
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PublicApiService);
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly settings = this.store.settings;
  protected readonly text = UI_TEXT[this.locale].contact;
  protected readonly projectTypes = this.text.projectTypes;
  protected readonly budgetRanges = this.text.budgetRanges;

  protected readonly sent = signal(false);
  protected readonly pending = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
    projectType: [this.projectTypes[0], Validators.required],
    eventDate: [''],
    budgetRange: [this.budgetRanges[4], Validators.required],
    message: ['', Validators.maxLength(2000)],
    website: [''],
  });

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
      return;
    }

    const value = this.form.getRawValue();
    this.pending.set(true);
    this.api
      .submitLead({ ...value, eventDate: value.eventDate || null })
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
