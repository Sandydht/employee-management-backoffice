import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'employees',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/employee/pages/employee-list-page/employee-list-page').then(
            (m) => m.EmployeeListPage,
          ),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./features/employee/pages/employee-add-page/employee-add-page').then(
            (m) => m.EmployeeAddPage,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/employee/pages/employee-detail-page/employee-detail-page').then(
            (m) => m.EmployeeDetailPage,
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./features/employee/pages/employee-edit-page/employee-edit-page').then(
            (m) => m.EmployeeEditPage,
          ),
      },
    ],
  },
];
