import { Component, input, output } from '@angular/core';
import { Column } from '../../models/column.model';
import { SortState } from '../../models/sort-state.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTableComponent<T> {
  columns = input<Column<T>[]>([]);
  datas = input<T[]>([]);

  rowKey = input<keyof T>('id' as keyof T);

  sort = input<SortState>({ key: 'updatedAt', direction: 'asc' });

  sortChange = output<SortState>();

  loading = input(false);
  emptyText = input('No data available');

  get colSpan(): number {
    return this.columns().length;
  }

  handleSort(column: Column<T>) {
    if (!column.sortable) return;

    const key = (column.sortKey ?? column.key) as string;

    const direction: 'asc' | 'desc' =
      this.sort().key === key && this.sort().direction === 'asc' ? 'desc' : 'asc';

    this.sortChange.emit({ key, direction });
  }

  isActiveSort(col: Column<T>): boolean {
    return this.sort().key === (col.sortKey ?? col.key);
  }

  trackRow(index: number, row: T) {
    const key = this.rowKey();

    if (key && row[key] != null && row[key] !== '') {
      return row[key];
    }

    return index;
  }

  getCellValue(row: T, col: Column<T>) {
    return row[col.key as keyof T];
  }
}
