import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { InputSearchComponent } from '../../../../shared/components/input-search/input-search';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { PaginationMeta } from '../../../../shared/models/pagination-meta.model';
import { Column } from '../../../../shared/models/column.model';
import { Employee } from '../../models/employee.model';
import { SortState } from '../../../../shared/models/sort-state.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table';
import { EmployeeService } from '../../../../core/services/employee-service/employee-service';
import { PaginationQuery } from '../../../../shared/models/pagination-query.model';
import { PaginatedResult } from '../../../../shared/models/paginated-result.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import * as ConfirmaActions from '../../../../shared/components/confirmation-modal/store/confirm-modal.actions';
import { Store } from '@ngrx/store';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';

@Component({
  selector: 'app-employee-list-page',
  imports: [
    InputSearchComponent,
    ButtonComponent,
    PaginationComponent,
    DataTableComponent,
    CurrencyPipe,
    FormsModule,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './employee-list-page.html',
  styleUrl: './employee-list-page.css',
})
export class EmployeeListPage implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly search$ = new Subject<string>();
  private readonly store = inject(Store);

  usernameTemplate = viewChild<TemplateRef<{ $implicit: Employee }>>('usernameTemplate');
  birthDateTemplate = viewChild<TemplateRef<{ $implicit: Employee }>>('birthDateTemplate');
  salaryTemplate = viewChild<TemplateRef<{ $implicit: Employee }>>('salaryTemplate');
  actionsTemplate = viewChild<TemplateRef<{ $implicit: Employee }>>('actionsTemplate');

  paginationMeta = signal<PaginationMeta>({
    page: 1,
    size: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  sort = signal<SortState>({ key: 'createdAt', direction: 'desc' });
  employees = signal<Employee[]>([]);
  search = signal<string>('');

  columns = computed<Column<Employee>[]>(() => [
    {
      key: 'username',
      header: 'Username',
      sortKey: 'username',
      sortable: true,
      template: this.usernameTemplate(),
    },
    {
      key: 'firstName',
      header: 'First Name',
      sortKey: 'firstName',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortKey: 'email',
      sortable: true,
    },
    {
      key: 'birthDate',
      header: 'Birth Date',
      sortKey: 'birthDate',
      sortable: true,
      template: this.birthDateTemplate(),
    },
    {
      key: 'basicSalary',
      header: 'Basic Salary',
      sortKey: 'basicSalary',
      sortable: true,
      template: this.salaryTemplate(),
    },
    {
      key: 'status',
      header: 'Status',
      sortKey: 'status',
      sortable: true,
    },
    {
      key: 'group',
      header: 'Group',
      sortKey: 'group',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      template: this.actionsTemplate(),
    },
  ]);

  query = computed<PaginationQuery>(() => ({
    page: this.paginationMeta().page,
    size: this.paginationMeta().size,
    sortBy: this.sort().key,
    sortOrder: this.sort().direction,
    search: this.search(),
  }));

  ngOnInit(): void {
    this.fetchEmployeeList();

    this.search$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.search.set(value);

        this.paginationMeta.update((meta) => ({
          ...meta,
          page: 1,
        }));

        this.fetchEmployeeList();
      });
  }

  onPageChange(page: number): void {
    this.paginationMeta.update((meta) => ({
      ...meta,
      page,
    }));
    this.fetchEmployeeList();
  }

  onPageSizeChange(size: number): void {
    this.paginationMeta.update((meta) => ({
      ...meta,
      size,
      page: 1,
    }));
  }

  onSortChange(value: SortState): void {
    this.sort.set(value);
    this.fetchEmployeeList();
  }

  onSearchChange(value: string) {
    this.search$.next(value);
  }

  fetchEmployeeList(): void {
    this.employeeService
      .getEmployeeList(this.query())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: PaginatedResult<Employee>) => {
          this.employees.set(response.data);
          this.paginationMeta.set(response.meta);
        },
      });
  }

  goToEditPage(userId: string): void {
    this.router.navigate([`/employees/${userId}/edit`]);
  }

  goToAddPage(): void {
    this.router.navigate(['/employees/add']);
  }

  openConfirmationModalBoxDeleteEmployee(userId: string): void {
    this.store.dispatch(
      ConfirmaActions.openConfirmModal({
        title: 'Delete Employee',
        message: 'Are you sure you want to delete this employee data?',
        onConfirmAction: () => {
          this.employeeService
            .deleteEmployee(userId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (response: Employee) => {
                if (response.id) {
                  this.fetchEmployeeList();
                  this.store.dispatch(
                    SnackbarActions.showSnackbar({
                      message: 'Employee data has been deleted successfully',
                      variant: 'success',
                    }),
                  );
                }
              },
              error: (err) => {
                this.store.dispatch(
                  SnackbarActions.showSnackbar({
                    message: err?.error?.message || 'Internal Server Error',
                    variant: 'success',
                  }),
                );
              },
            });
        },
      }),
    );
  }
}
