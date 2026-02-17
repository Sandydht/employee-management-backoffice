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

@Component({
  selector: 'app-employee-detail-page',
  imports: [CommonModule, ButtonComponent, ToTitleCasePipe],
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
  employee = signal<Employee | null>(null);

  ngOnInit(): void {
    this.employeeId.set(this.route.snapshot.paramMap.get('id') || null);
    this.fetchEmployeeData();
  }

  goToEmployeeListPage(): void {
    this.router.navigate(['/employees']);
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
