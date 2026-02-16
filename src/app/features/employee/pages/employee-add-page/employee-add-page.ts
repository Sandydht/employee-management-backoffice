import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputCurrencyComponent } from '../../../../shared/components/input-currency/input-currency';
import { InputDateComponent } from '../../../../shared/components/input-date/input-date';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';

@Component({
  selector: 'app-employee-add-page',
  imports: [
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    InputCurrencyComponent,
    InputDateComponent,
    TextareaComponent,
  ],
  templateUrl: './employee-add-page.html',
  styleUrl: './employee-add-page.css',
})
export class EmployeeAddPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required]],
    basicSalary: [0, [Validators.required, Validators.min(1)]],
    group: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  get usernameError(): string {
    const control = this.form.controls.username;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Username is required';

    return '';
  }

  get firstNameError(): string {
    const control = this.form.controls.firstName;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'First Name is required';

    return '';
  }

  get lastNameError(): string {
    const control = this.form.controls.lastName;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Last Name is required';

    return '';
  }

  get emailError(): string {
    const control = this.form.controls.email;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Email is required';
    if (control.hasError('email')) return 'Email is invalid';

    return '';
  }

  get birthDateError(): string {
    const control = this.form.controls.birthDate;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Birth Date is required';

    return '';
  }

  get basicSalaryError(): string {
    const control = this.form.controls.basicSalary;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Salary is required';
    if (control.hasError('min')) return 'Salary is required';

    return '';
  }

  get groupError(): string {
    const control = this.form.controls.group;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Group is required';

    return '';
  }

  get descriptionError(): string {
    const control = this.form.controls.description;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Description is required';

    return '';
  }

  goToEmployeeListPage(): void {
    this.router.navigate(['/employees']);
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  submit(): void {
    console.log(this.form.controls.username.value);
    console.log(this.form.controls.firstName.value);
    console.log(this.form.controls.lastName.value);
    console.log(this.form.controls.email.value);
    console.log(this.formatDate(new Date(this.form.controls.birthDate.value)));
    console.log(this.form.controls.basicSalary.value);
    console.log(this.form.controls.group.value);
    console.log(this.form.controls.description.value);
  }
}
