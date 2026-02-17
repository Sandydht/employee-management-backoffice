import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { Router } from '@angular/router';
import { InputComponent } from '../../../../shared/components/input/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputCurrencyComponent } from '../../../../shared/components/input-currency/input-currency';
import { InputDateComponent } from '../../../../shared/components/input-date/input-date';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { Store } from '@ngrx/store';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';
import { AddUpdateEmployeeRequest } from '../../models/add-employee-request.model';
import { EmployeeService } from '../../../../core/services/employee-service/employee-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee } from '../../models/employee.model';
import { DropdownDataOptions } from '../../../../shared/models/dropdown-data-options.model';
import { InputAutocompleteComponent } from '../../../../shared/components/input-autocomplete/input-autocomplete';
import { DateYMDPipe } from '../../../../shared/pipes/date-ymd-pipe/date-ymd-pipe';

@Component({
  selector: 'app-employee-add-page',
  imports: [
    ButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    InputCurrencyComponent,
    InputDateComponent,
    TextareaComponent,
    InputAutocompleteComponent,
  ],
  providers: [DateYMDPipe],
  templateUrl: './employee-add-page.html',
  styleUrl: './employee-add-page.css',
})
export class EmployeeAddPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required]],
    basicSalary: [0, [Validators.required, Validators.min(1)]],
    status: ['', [Validators.required]],
    group: ['Test', [Validators.required]],
    description: ['', [Validators.required]],
  });

  loading = signal<boolean>(false);
  statusDataOptions: DropdownDataOptions[] = [
    {
      key: 'ACTIVE',
      label: 'ACTIVE',
    },
    {
      key: 'INACTIVE',
      label: 'INACTIVE',
    },
  ];

  groupDataOptions: DropdownDataOptions[] = [
    { key: 'product_management', label: 'Product Management' },
    { key: 'legal', label: 'Legal' },
    { key: 'accounting', label: 'Accounting' },
    { key: 'engineering', label: 'Engineering' },
    { key: 'human_resources', label: 'Human Resources' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'research_and_development', label: 'Research and Development' },
    { key: 'sales', label: 'Sales' },
    { key: 'training', label: 'Training' },
    { key: 'services', label: 'Services' },
  ];

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

  get statusError(): string {
    const control = this.form.controls.status;

    if (!control?.touched) return '';
    if (control.hasError('required')) return 'Status is required';

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
    this.router.navigate(['/employees'], { queryParamsHandling: 'preserve' });
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  submit(): void {
    this.loading.set(true);
    const payload: AddUpdateEmployeeRequest = {
      username: this.form.controls.username.value,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      email: this.form.controls.email.value,
      birthDate: this.form.controls.birthDate.value,
      basicSalary: this.form.controls.basicSalary.value,
      status: this.form.controls.status.value,
      group: this.form.controls.group.value,
      description: this.form.controls.description.value,
    };

    this.employeeService
      .addEmployee(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Employee) => {
          if (response.id) {
            this.store.dispatch(
              SnackbarActions.showSnackbar({
                message: 'Employee data has been saved successfully',
                variant: 'success',
              }),
            );
            this.loading.set(false);
            this.router.navigate(['/employees']);
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.store.dispatch(
            SnackbarActions.showSnackbar({ message: error?.error?.message, variant: 'error' }),
          );
        },
      });
  }
}
