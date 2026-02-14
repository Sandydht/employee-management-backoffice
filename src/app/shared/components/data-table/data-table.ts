import { Component, input, output } from '@angular/core';
import { Column } from '../../models/column.model';
import { SortState } from '../../models/sort-state.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTableComponent<T> {
  // Inputs
  columns = input<Column<T>[]>([]);
  datas = input<T[]>([]);

  // Row key (field name)
  rowKey = input<keyof T>();

  // Sorting
  sort = input<SortState>({
    key: 'firstName',
    direction: 'asc',
  });

  sortChange = output<SortState>();

  // UI States
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

  trackRow(row: T) {
    const key = this.rowKey();
    return key ? row[key] : row;
  }

  getCellValue(row: T, col: Column<T>) {
    return row[col.key as keyof T];
  }
}
