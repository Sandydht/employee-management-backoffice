import { Component, computed, input } from '@angular/core';
import { Employee } from '../../../employee/models/employee.model';
import { Column } from '../../../../shared/models/column.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table';

@Component({
  selector: 'app-recent-employees-table',
  imports: [DataTableComponent],
  templateUrl: './recent-employees-table.html',
  styleUrl: './recent-employees-table.css',
})
export class RecentEmployeesTableComponent {
  employees = input<Employee[]>([]);

  columns = computed<Column<Employee>[]>(() => [
    {
      key: 'firstName',
      header: 'First Name',
      sortKey: 'firstName',
      sortable: false,
    },
    {
      key: 'status',
      header: 'Status',
      sortKey: 'status',
      sortable: false,
    },
    {
      key: 'group',
      header: 'Group',
      sortKey: 'group',
      sortable: false,
    },
  ]);
}
