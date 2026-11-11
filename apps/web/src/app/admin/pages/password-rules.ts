import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Règles alignées sur l'API (Identity) : 10 caractères, une minuscule, une majuscule, un chiffre. */
export const PASSWORD_RULES_HINT =
  'Au moins 10 caractères, dont une minuscule, une majuscule et un chiffre.';

export const strongPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '');
  const ok = value.length >= 10 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);
  return ok ? null : { strongPassword: true };
};

/** Validateur de groupe : `newPassword` et `confirm` doivent correspondre. */
export const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const next = group.get('newPassword')?.value;
  const confirm = group.get('confirm')?.value;
  return next && confirm && next !== confirm ? { mismatch: true } : null;
};
