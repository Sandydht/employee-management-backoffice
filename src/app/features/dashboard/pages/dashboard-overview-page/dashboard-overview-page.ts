import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard-service/dashboard-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetTotalEmployeesResponse } from '../../models/get-total-employees-response.model';
import { EmployeeStatusChartComponent } from '../../components/employee-status-chart/employee-status-chart';
import { Employee } from '../../../employee/models/employee.model';
import { RecentEmployeesTableComponent } from '../../components/recent-employees-table/recent-employees-table';
import * as SnackbarActions from '../../../../shared/components/snackbar/store/snackbar.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dashboard-overview-page',
  imports: [EmployeeStatusChartComponent, RecentEmployeesTableComponent],
  templateUrl: './dashboard-overview-page.html',
  styleUrl: './dashboard-overview-page.css',
})
export class DashboardOverviewPage implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);

  totalEmployeesData = signal<GetTotalEmployeesResponse>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });
  fetchTotalEmployeesLoading = signal<boolean>(false);

  employees = signal<Employee[]>([]);
  fetchEmployeeListLoading = signal<boolean>(false);

  recentEmployees = signal<Employee[]>([]);
  fetchRecentEmployeeListLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchTotalEmployees();
    this.fetchEmployeeList();
    this.fetchRecentEmployeeList();
  }

  fetchTotalEmployees(): void {
    this.fetchTotalEmployeesLoading.set(true);
    this.dashboardService
      .getTotalEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: GetTotalEmployeesResponse) => {
          this.totalEmployeesData.set(response);
          this.fetchTotalEmployeesLoading.set(false);
        },
        error: (err) => {
          this.fetchTotalEmployeesLoading.set(false);
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
        },
      });
  }

  fetchEmployeeList(): void {
    this.fetchEmployeeListLoading.set(true);
    this.dashboardService
      .getEmployeeList({ recent: false })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Employee[]) => {
          if (response.length > 0) {
            this.employees.set(response);
            this.fetchEmployeeListLoading.set(false);
          }
        },
        error: (err) => {
          this.fetchEmployeeListLoading.set(false);
          this.store.dispatch(
            SnackbarActions.showSnackbar({
              message: err?.error?.message || 'Internal Server Error',
              variant: 'error',
            }),
          );
        },
      });
  }

  fetchRecentEmployeeList(): void {
    this.fetchRecentEmployeeListLoading.set(true);
    this.dashboardService
      .getEmployeeList({ recent: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Employee[]) => {
          if (response.length > 0) {
            this.recentEmployees.set(response);
            this.fetchRecentEmployeeListLoading.set(false);
          }
        },
        error: (err) => {
          this.fetchRecentEmployeeListLoading.set(false);
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
