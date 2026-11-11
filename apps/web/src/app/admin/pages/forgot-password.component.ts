import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { AuthService } from '../../core/auth/auth.service';
import { authErrorMessage } from '../../core/auth/auth-error';

/** Demande d'un lien de réinitialisation du mot de passe. */
@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, LogotypeComponent],
  template: `
    <main class="login">
      <form class="login__box a-card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <app-logotype />
        <h1 class="a-title">Mot de passe oublié</h1>

        @if (sent()) {
          <p role="status">
            Si un compte existe pour <strong>{{ form.controls.email.value }}</strong
            >, un e-mail vient de partir avec un lien pour choisir un nouveau mot de passe. Le lien
            est valable une heure.
          </p>
        } @else {
          <p class="a-hint">
            Indiquez l'e-mail de votre compte : vous recevrez un lien pour choisir un nouveau mot de
            passe.
          </p>

          <div class="a-field">
            <label class="a-label" for="email">E-mail</label>
            <input
              id="email"
              class="a-input"
              type="email"
              formControlName="email"
              autocomplete="username"
              required
            />
          </div>

          @if (error()) {
            <p class="a-error" role="alert">{{ error() }}</p>
          }

          <button class="a-btn" type="submit" [disabled]="pending()">
            {{ pending() ? 'Envoi…' : 'Recevoir le lien' }}
          </button>
        }

        <a class="login__link" routerLink="/admin/login">Retour à la connexion</a>
      </form>
    </main>
  `,
  styleUrl: './auth-page.scss',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly pending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Indiquez une adresse e-mail valide.');
      return;
    }
    this.error.set(null);
    this.pending.set(true);
    this.auth.forgotPassword(this.form.getRawValue().email).subscribe({
      next: () => {
        this.pending.set(false);
        this.sent.set(true);
      },
      error: (err: unknown) => {
        this.pending.set(false);
        this.error.set(authErrorMessage(err, "La demande n'a pas pu être envoyée."));
      },
    });
  }
}
