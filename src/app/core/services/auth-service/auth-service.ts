import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginRequest } from '../../../features/auth/models/login-request.model';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../../features/auth/models/login-response.model';
import { StorageService } from '../storage-service/storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private loggedIn = signal(false);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', payload).pipe(
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

  isAuthenticated(): boolean {
    return Boolean(this.storageService.get('token'));
  }
}
