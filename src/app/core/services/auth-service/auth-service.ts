import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginRequest } from '../../../features/auth/models/login-request.model';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../../features/auth/models/login-response.model';
import { StorageService } from '../storage-service/storage-service';
import { environment } from '../../../../environments/environment';
import { IS_PUBLIC_API } from '../../interceptors/request-context';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private loggedIn = signal(false);
  private readonly apiUrl = environment.apiUrl;

  get getToken(): string | null {
    return this.storageService.get('token');
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, payload, {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      })
      .pipe(
        tap((res) => {
          this.storageService.set('token', res.token);
          this.loggedIn.set(true);
        }),
      );
  }

  logout(): void {
    this.storageService.clear();
    this.loggedIn.set(false);
  }
}
