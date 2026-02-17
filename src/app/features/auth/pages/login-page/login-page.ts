import { Component, signal, inject, DestroyRef } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { InputPasswordComponent } from '../../../../shared/components/input-password/input-password';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { LoginRequest } from '../../models/login-request.model';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, InputComponent, InputPasswordComponent, ButtonComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  loading = signal(false);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get usernameError(): string {
    const control = this.form.controls.username;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Username is required';
    if (control.hasError('minlength')) return 'Minimum 3 characters';

    return '';
  }

  get passwordError(): string {
    const control = this.form.controls.password;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Password is required';
    if (control.hasError('minlength')) return 'Minimum 6 characters';

    return '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const payload: LoginRequest = this.form.getRawValue();

    this.authService
      .login(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.store.dispatch(
            SnackbarActions.showSnackbar({ message: err?.error?.message, variant: 'error' }),
          );
        },
      });
  }
}
