import { Component, signal } from '@angular/core';
import { InputSearchComponent } from '../../../../shared/components/input-search/input-search';
import { ButtonComponent } from '../../../../shared/components/button/button';
import {
  PaginationComponent,
  PaginationMeta,
} from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-employee-list-page',
  imports: [InputSearchComponent, ButtonComponent, PaginationComponent],
  templateUrl: './employee-list-page.html',
  styleUrl: './employee-list-page.css',
})
export class EmployeeListPage {
  paginationMeta = signal<PaginationMeta>({
    page: 1,
    size: 10,
    totalItems: 100,
    totalPages: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  onPageChange(page: number): void {
    this.paginationMeta.update((meta) => ({
      ...meta,
      page,
    }));
  }

  onPageSizeChange(size: number) {
    this.paginationMeta.update((meta) => ({
      ...meta,
      size,
      page: 1,
    }));
  }
}
