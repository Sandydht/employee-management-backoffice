import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { publicInterceptor } from './core/interceptors/public.interceptor';
import { privateInterceptor } from './core/interceptors/private.interceptor';
import { authErrorInterceptor } from './core/interceptors/auth-error.interceptor';
import { LOCALE_ID } from '@angular/core';
import localeId from '@angular/common/locales/id';
import { registerLocaleData } from '@angular/common';
import { AuthService } from './core/services/auth-service/auth-service';
import { APP_INITIALIZER } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { confirmModalReducer } from './shared/components/confirmation-modal/store/confirm-modal.reducer';
import { ConfirmModalEffects } from './shared/components/confirmation-modal/store/confirm-modal.effects';
import { snackbarReducer } from './shared/components/snackbar/store/snackbar.reducer';
import { SnackbarEffects } from './shared/components/snackbar/store/snackbar.effects';
import { sidebarReducer } from './layouts/side-bar/store/sidebar.reducer';
import { SidebarEffects } from './layouts/side-bar/store/sidebar.effects';
import { firstValueFrom } from 'rxjs';
import { MockDbInitService } from '../mocks/indexed-db/mock-db-init.mock-db.service';

registerLocaleData(localeId);

export function initApp(auth: AuthService, db: MockDbInitService) {
  return async () => {
    await db.init();

    auth.loadToken();

    if (auth.token()) {
      await firstValueFrom(auth.getProfile());
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([publicInterceptor, privateInterceptor, authErrorInterceptor]),
    ),
    { provide: LOCALE_ID, useValue: 'id-ID' },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthService, MockDbInitService],
      multi: true,
    },
    provideStore({
      confirmModal: confirmModalReducer,
      snackbar: snackbarReducer,
      sidebar: sidebarReducer,
    }),
    provideEffects([ConfirmModalEffects, SnackbarEffects, SidebarEffects]),
  ],
};
