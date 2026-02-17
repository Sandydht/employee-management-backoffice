import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../../../shared/models/paginated-result.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PaginationQuery } from '../../../shared/models/pagination-query.model';
import { Employee } from '../../../features/employee/models/employee.model';
import { AddEmployeeRequest } from '../../../features/employee/models/add-employee-request.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getEmployeeList(payload: PaginationQuery): Observable<PaginatedResult<Employee>> {
    const params = new HttpParams()
      .set('page', Number(payload.page || 1))
      .set('size', Number(payload.size || 10))
      .set('sortBy', String(payload.sortBy || 'updatedAt'))
      .set('sortOrder', String(payload.sortOrder || 'desc'))
      .set('search', String(payload.search || ''));

    return this.http.get<PaginatedResult<Employee>>(`${this.apiUrl}/employee/list`, { params });
  }

  getEmployeeDetail(id: string | null): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employee/${id}`);
  }

  addEmployee(payload: AddEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employee/add`, payload);
  }

  deleteEmployee(id: string | null): Observable<Employee> {
    return this.http.delete<Employee>(`${this.apiUrl}/employee/${id}/delete`);
  }
}
