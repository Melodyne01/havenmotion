import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { AuthService } from '../../core/auth/auth.service';

/** Entrée du backoffice. */
@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LogotypeComponent],
  template: `
    <main class="login">
      <form class="login__box a-card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <app-logotype />
        <h1 class="a-title">Backoffice</h1>

        <div class="a-field">
          <label class="a-label" for="email">E-mail</label>
          <input
            id="email"
            class="a-input"
            type="email"
            formControlName="email"
            autocomplete="username"
          />
        </div>

        <div class="a-field">
          <label class="a-label" for="password">Mot de passe</label>
          <input
            id="password"
            class="a-input"
            type="password"
            formControlName="password"
            autocomplete="current-password"
          />
        </div>

        @if (error()) {
          <p class="a-error" role="alert">{{ error() }}</p>
        }

        <button class="a-btn" type="submit" [disabled]="pending()">
          {{ pending() ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </main>
  `,
  styles: [
    `
      @use 'tokens' as *;

      .login {
        display: grid;
        place-items: center;
        min-height: 100vh;
        padding: $pad-x-mobile;
        background: $color-charcoal;
      }

      .login__box {
        display: grid;
        gap: 18px;
        width: 100%;
        max-width: 380px;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly pending = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.pending.set(true);

    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.pending.set(false);
        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/admin/categories';
        void this.router.navigateByUrl(redirect);
      },
      error: () => {
        this.pending.set(false);
        this.error.set('Identifiants refusés.');
      },
    });
  }
}
