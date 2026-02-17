import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetTotalEmployeesResponse } from '../../../features/dashboard/models/get-total-employees-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Employee } from '../../../features/employee/models/employee.model';
import { GetEmployeeListRequest } from '../../../features/dashboard/models/get-employee-list-request.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getTotalEmployees(): Observable<GetTotalEmployeesResponse> {
    return this.http.get<GetTotalEmployeesResponse>(`${this.apiUrl}/dashboard/total-employees`);
  }

  getEmployeeList(payload: GetEmployeeListRequest): Observable<Employee[]> {
    const params = new HttpParams().set('recent', Boolean(payload.recent));

    return this.http.get<Employee[]>(`${this.apiUrl}/dashboard/employee-list`, { params });
  }
}
