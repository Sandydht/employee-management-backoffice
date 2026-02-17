import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../../core/services/employee-service/employee-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee } from '../../models/employee.model';
import { InputCurrencyComponent } from '../../../../shared/components/input-currency/input-currency';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { InputDateComponent } from '../../../../shared/components/input-date/input-date';
import { InputAutocompleteComponent } from '../../../../shared/components/input-autocomplete/input-autocomplete';
import { DropdownDataOptions } from '../../../../shared/models/dropdown-data-options.model';
import { DateYMDPipe } from '../../../../shared/pipes/date-ymd-pipe/date-ymd-pipe';
import { AddUpdateEmployeeRequest } from '../../models/add-employee-request.model';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-employee-edit-page',
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    InputCurrencyComponent,
    TextareaComponent,
    InputDateComponent,
    InputAutocompleteComponent,
  ],
  providers: [DateYMDPipe],
  templateUrl: './employee-edit-page.html',
  styleUrl: './employee-edit-page.css',
})
export class EmployeeEditPage implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly dateYMDPipe = inject(DateYMDPipe);
  private readonly store = inject(Store);

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
    {
      key: 'product_management',
      label: 'Product Management',
    },
    {
      key: 'legal',
      label: 'Legal',
    },
    {
      key: 'accounting',
      label: 'Accounting',
    },
    {
      key: 'engineering',
      label: 'Engineering',
    },
    {
      key: 'human_resources',
      label: 'Human Resources',
    },
    {
      key: 'marketing',
      label: 'Marketing',
    },
    {
      key: 'accounting',
      label: 'Accounting',
    },
    {
      key: 'research_and_development',
      label: 'Research and Development',
    },
    {
      key: 'sales',
      label: 'Sales',
    },
    {
      key: 'marketing',
      label: 'Marketing',
    },
  ];

  employeeId = signal<string | null>(null);
  loading = signal<boolean>(false);

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

  ngOnInit(): void {
    this.employeeId.set(this.route.snapshot.paramMap.get('id') || null);
    this.fetchEmployeeData();
  }

  fetchEmployeeData(): void {
    this.employeeService
      .getEmployeeDetail(this.employeeId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Employee) => {
          if (response.id) {
            this.form.patchValue({
              ...response,
              birthDate: this.dateYMDPipe.transform(new Date(response.birthDate)),
            });
          }
        },
      });
  }

  goToEmployeeListPage(): void {
    this.router.navigate(['/employees']);
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
      .editEmployee(String(this.employeeId()), payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Employee) => {
          if (response.id) {
            this.store.dispatch(
              SnackbarActions.showSnackbar({
                message: 'Employee data has been updated successfully',
                variant: 'success',
              }),
            );
            this.loading.set(false);
            this.router.navigate(['/employees']);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
        },
      });
  }
}
