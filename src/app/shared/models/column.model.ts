import { TemplateRef } from '@angular/core';

export interface Column<T> {
  key: keyof T | string;
  header: string;

  sortable?: boolean;
  sortKey?: string;

  template?: TemplateRef<{ $implicit: T }>;
}
