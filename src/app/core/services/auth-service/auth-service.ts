import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginRequest } from '../../../features/auth/models/login-request.model';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../../features/auth/models/login-response.model';
import { StorageService } from '../storage-service/storage-service';
import { environment } from '../../../../environments/environment';
import { IS_PUBLIC_API } from '../../interceptors/request-context.interceptor';
import { User } from '../../../features/auth/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageService);
  private readonly apiUrl = environment.apiUrl;
  private readonly userData = signal<User | null>(null);
  private readonly router = inject(Router);
  private readonly tokenSignal = signal<string | null>(this.storageService.get('token'));

  token = computed(() => this.tokenSignal());
  userFullName = computed(() => `${this.userData()?.firstName} ${this.userData()?.lastName}`);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, payload, {
        context: new HttpContext().set(IS_PUBLIC_API, true),
      })
      .pipe(
        tap((res: LoginResponse) => {
          this.storageService.set('token', res.token);
          this.tokenSignal.set(res.token);
        }),
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/profile`).pipe(
      tap((res: User) => {
        this.userData.set(res);
      }),
    );
  }

  logout(): void {
    this.storageService.clear();
    this.userData.set(null);
    this.router.navigate(['/login']);
  }
}
