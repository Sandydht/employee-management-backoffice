import { Component, computed, signal, TemplateRef, viewChild } from '@angular/core';
import { InputSearchComponent } from '../../../../shared/components/input-search/input-search';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { PaginationMeta } from '../../../../shared/models/pagination-meta.model';
import { Column } from '../../../../shared/models/column.model';
import { Employee } from '../../models/employee.model';
import { SortState } from '../../../../shared/models/sort-state.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-employee-list-page',
  imports: [InputSearchComponent, ButtonComponent, PaginationComponent, DataTableComponent],
  templateUrl: './employee-list-page.html',
  styleUrl: './employee-list-page.css',
})
export class EmployeeListPage {
  actionsTemplate = viewChild<TemplateRef<{ $implicit: Employee }>>('actionsTemplate');

  paginationMeta = signal<PaginationMeta>({
    page: 1,
    size: 10,
    totalItems: 100,
    totalPages: 1000,
    hasNextPage: true,
    hasPrevPage: true,
  });

  sort = signal<SortState>({ key: 'username', direction: 'asc' });

  employees = signal<Employee[]>([
    {
      id: 'user-1',
      username: 'user1',
      firstName: 'User',
      lastName: '1',
      email: 'user1@email.com',
      birthDate: '2025-03-02',
      basicSalary: 10000000,
      status: 'Active',
      group: 'IT',
      description: 'This is User 1',
      createdAt: '',
      updatedAt: '',
      deletedAt: '',
    },
  ]);

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

  onPageChange(page: number): void {
    this.paginationMeta.update((meta) => ({
      ...meta,
      page,
    }));
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
  }
}
