import { Component, computed, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
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

@Component({
  selector: 'app-employee-list-page',
  imports: [InputSearchComponent, ButtonComponent, PaginationComponent, DataTableComponent],
  templateUrl: './employee-list-page.html',
  styleUrl: './employee-list-page.css',
})
export class EmployeeListPage implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  actionsTemplate = viewChild<TemplateRef<{ $implicit: Employee }>>('actionsTemplate');

  paginationMeta = signal<PaginationMeta>({
    page: 1,
    size: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  sort = signal<SortState>({ key: 'updatedAt', direction: 'desc' });

  employees = signal<Employee[]>([]);

  columns = computed<Column<Employee>[]>(() => [
    {
      key: 'username',
      header: 'Username',
      sortKey: 'username',
      sortable: true,
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
    },
    {
      key: 'basicSalary',
      header: 'Basic Salary',
      sortKey: 'basicSalary',
      sortable: true,
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

  ngOnInit(): void {
    this.fetchEmployeeList();
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

    this.fetchEmployeeList();
  }

  onSortChange(value: SortState): void {
    this.sort.set(value);

    this.fetchEmployeeList();
  }

  fetchEmployeeList(): void {
    const query: PaginationQuery = {
      page: this.paginationMeta().page,
      size: this.paginationMeta().size,
      sortBy: this.sort().key,
      sortOrder: this.sort().direction,
    };

    this.employeeService.getEmployeeList(query).subscribe({
      next: (response: PaginatedResult<Employee>) => {
        this.employees.set(response.data);
        this.paginationMeta.set(response.meta);
      },
    });
  }
}
