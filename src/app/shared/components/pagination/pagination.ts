import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside/click-outside';
import { PaginationMeta } from '../../models/pagination-meta.model';
import { PageItem } from '../../models/page-item.model';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent implements OnChanges {
  paginationMeta = input<PaginationMeta>();
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  pageChange = output<number>();
  pageSizeChange = output<number>();

  pages = signal<PageItem[]>([]);
  isOpenPageSizeDropdown = signal<boolean>(false);

  ngOnChanges(): void {
    this.pages.set(this.generatePages());
  }

  generatePages(): PageItem[] {
    const meta = this.paginationMeta();
    if (!meta) return [];

    const total = meta.totalPages;
    const current = meta.page;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const result: PageItem[] = [];

    result.push(1);

    // Left dots
    if (current > 3) result.push('...');

    // Middle range hanya 2 angka
    const start = Math.max(2, current);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    // Right dots
    if (current < total - 2) result.push('...');

    result.push(total);

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

  togglePageSizeDropdown(): void {
    this.isOpenPageSizeDropdown.update((value) => !value);
  }

  closeOpenPageSizeDropdown(): void {
    this.isOpenPageSizeDropdown.set(false);
  }

  selectPageSize(size: number): void {
    this.isOpenPageSizeDropdown.set(false);
    this.pageSizeChange.emit(size);
    this.pageChange.emit(1);
  }
}
