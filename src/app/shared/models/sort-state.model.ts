import { SortOrder } from './sort-order.model';

export interface SortState {
  key: string;
  direction: SortOrder;
}
