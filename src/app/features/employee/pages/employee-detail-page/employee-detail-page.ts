import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../../core/services/employee-service/employee-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToTitleCasePipe } from '../../../../shared/pipes/to-title-case-pipe/to-title-case-pipe';
import { Store } from '@ngrx/store';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { RupiahPipe } from '../../../../shared/pipes/rupiah-pipe/rupiah-pipe-pipe';

@Component({
  selector: 'app-employee-detail-page',
  imports: [CommonModule, ButtonComponent, ToTitleCasePipe, StatusBadgeComponent, RupiahPipe],
  providers: [DatePipe],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.css',
})
export class EmployeeDetailPage implements OnInit {
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  employeeId = signal<string | null>(null);
  employee = signal<Employee>({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    basicSalary: 0,
    status: 'ACTIVE',
    group: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  });

  ngOnInit(): void {
    this.employeeId.set(this.route.snapshot.paramMap.get('id') || null);
    this.fetchEmployeeData();
  }

  goToEmployeeListPage(): void {
    this.router.navigate(['/employees'], { queryParamsHandling: 'preserve' });
  }

  fetchEmployeeData(): void {
    this.employeeService
      .getEmployeeDetail(this.employeeId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Employee) => {
          if (response.id) {
            this.employee.set(response);
          }
        },
        error: (err) => {
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
        },
      });
  }
}
