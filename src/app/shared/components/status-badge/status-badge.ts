import { Component, input } from '@angular/core';
import { EmployeeStatus } from '../../../features/employee/models/employee-status.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadgeComponent {
  value = input<EmployeeStatus>('ACTIVE');
}
