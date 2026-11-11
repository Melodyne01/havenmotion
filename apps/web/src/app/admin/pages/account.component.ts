import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { authErrorMessage } from '../../core/auth/auth-error';
import { PASSWORD_RULES_HINT, passwordsMatch, strongPassword } from './password-rules';

/** Mon compte : changement du mot de passe de l'utilisateur connecté. */
@Component({
  selector: 'app-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Mon compte</h1>
      </header>

      <form class="a-card account" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <p class="a-hint">
          Connecté en tant que <strong>{{ email() }}</strong
          >.
        </p>

        @if (mustChange()) {
          <p class="a-error" role="alert">
            Vous utilisez encore le mot de passe par défaut : choisissez-en un nouveau pour accéder
            au backoffice.
          </p>
        }

        <div class="a-field">
          <label class="a-label" for="currentPassword">Mot de passe actuel</label>
          <input
            id="currentPassword"
            class="a-input"
            type="password"
            formControlName="currentPassword"
            autocomplete="current-password"
            required
          />
        </div>

        <div class="a-field">
          <label class="a-label" for="newPassword">Nouveau mot de passe</label>
          <input
            id="newPassword"
            class="a-input"
            type="password"
            formControlName="newPassword"
            autocomplete="new-password"
            required
          />
          <span class="a-hint">{{ rules }}</span>
        </div>

        <div class="a-field">
          <label class="a-label" for="confirm">Confirmer le nouveau mot de passe</label>
          <input
            id="confirm"
            class="a-input"
            type="password"
            formControlName="confirm"
            autocomplete="new-password"
            required
          />
        </div>

        @if (error()) {
          <p class="a-error" role="alert">{{ error() }}</p>
        }
        @if (success()) {
          <p class="a-hint" role="status">
            Mot de passe modifié. Vos autres sessions ont été déconnectées.
          </p>
        }

        <div class="a-actions">
          <button class="a-btn" type="submit" [disabled]="pending()">
            {{ pending() ? 'Enregistrement…' : 'Changer le mot de passe' }}
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [
    `
      .account {
        display: grid;
        gap: 18px;
        max-width: 460px;
      }
    `,
  ],
})
export class AccountComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = this.auth.email;
  protected readonly mustChange = this.auth.mustChangePassword;
  protected readonly rules = PASSWORD_RULES_HINT;

  protected readonly pending = signal(false);
  protected readonly success = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, strongPassword]],
      confirm: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    this.success.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(
        this.form.hasError('mismatch')
          ? 'Les deux nouveaux mots de passe ne correspondent pas.'
          : this.form.controls.currentPassword.invalid
            ? 'Indiquez votre mot de passe actuel.'
            : PASSWORD_RULES_HINT,
      );
      return;
    }
    const { currentPassword, newPassword } = this.form.getRawValue();
    if (currentPassword === newPassword) {
      this.error.set("Le nouveau mot de passe doit être différent de l'actuel.");
      return;
    }

    this.error.set(null);
    this.pending.set(true);
    const wasForced = this.mustChange();
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.pending.set(false);
        this.success.set(true);
        this.form.reset();
        if (wasForced) {
          void this.router.navigate(['/admin/categories']);
        }
      },
      error: (err: unknown) => {
        this.pending.set(false);
        this.error.set(authErrorMessage(err, "Le mot de passe n'a pas pu être changé."));
      },
    });
  }
}
