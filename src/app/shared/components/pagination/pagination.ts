import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, output, signal } from '@angular/core';

export type PaginationMeta = {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PageItem = number | '...';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent implements OnChanges {
  paginationMeta = input<PaginationMeta>();
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  pageChange = output<number>();

  pages = signal<PageItem[]>([]);

  ngOnChanges(): void {
    this.pages.set(this.generatePages());
  }

  generatePages(): PageItem[] {
    const totalPages = this.paginationMeta()?.totalPages || 0;
    const current = this.paginationMeta()?.page || 1;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const result: PageItem[] = [];

    result.push(1);

    if (current > 4) {
      result.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (current < totalPages - 3) {
      result.push('...');
    }

    result.push(totalPages);

    return result;
  }

  goToPage(page: number | string) {
    if (page === '...') return;
    this.pageChange.emit(page as number);
  }

  firstPage() {
    this.goToPage(1);
  }

  lastPage() {
    this.goToPage(this.paginationMeta()?.totalPages || 1);
  }

  nextPage() {
    if (this.paginationMeta()?.hasNextPage) {
      this.goToPage(this.paginationMeta()!.page + 1);
    }
  }

  prevPage() {
    if (this.paginationMeta()?.hasPrevPage) {
      this.goToPage(this.paginationMeta()!.page - 1);
    }
  }
}
