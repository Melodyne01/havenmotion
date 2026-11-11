import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { AuthService } from '../../core/auth/auth.service';
import { authErrorMessage } from '../../core/auth/auth-error';
import { PASSWORD_RULES_HINT, passwordsMatch, strongPassword } from './password-rules';

/** Nouveau mot de passe à partir du lien reçu par e-mail. */
@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, LogotypeComponent],
  template: `
    <main class="login">
      <form class="login__box a-card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <app-logotype />
        <h1 class="a-title">Nouveau mot de passe</h1>

        @if (done()) {
          <p role="status">Mot de passe enregistré. Vous pouvez vous connecter.</p>
          <a class="a-btn" routerLink="/admin/login">Se connecter</a>
        } @else if (!email || !token) {
          <p class="a-error" role="alert">
            Lien incomplet. Refaites une demande depuis « Mot de passe oublié ».
          </p>
          <a class="login__link" routerLink="/admin/mot-de-passe-oublie">Mot de passe oublié</a>
        } @else {
          <p class="a-hint">Compte : {{ email }}</p>

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
            <label class="a-label" for="confirm">Confirmer le mot de passe</label>
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

          <button class="a-btn" type="submit" [disabled]="pending()">
            {{ pending() ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        }
      </form>
    </main>
  `,
  styleUrl: './auth-page.scss',
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly params = inject(ActivatedRoute).snapshot.queryParamMap;

  protected readonly email = this.params.get('email') ?? '';
  protected readonly token = this.params.get('token') ?? '';
  protected readonly rules = PASSWORD_RULES_HINT;

  protected readonly pending = signal(false);
  protected readonly done = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      newPassword: ['', [Validators.required, strongPassword]],
      confirm: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(
        this.form.hasError('mismatch')
          ? 'Les deux mots de passe ne correspondent pas.'
          : PASSWORD_RULES_HINT,
      );
      return;
    }
    this.error.set(null);
    this.pending.set(true);
    this.auth.resetPassword(this.email, this.token, this.form.getRawValue().newPassword).subscribe({
      next: () => {
        this.pending.set(false);
        this.done.set(true);
      },
      error: (err: unknown) => {
        this.pending.set(false);
        this.error.set(authErrorMessage(err, "Le mot de passe n'a pas pu être enregistré."));
      },
    });
  }
}
