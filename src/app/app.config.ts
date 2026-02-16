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

registerLocaleData(localeId);

const initAuth = (auth: AuthService) => {
  return () => {
    if (auth.token()) {
      return auth.getProfile().toPromise();
    }
    return Promise.resolve();
  };
};

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
      useFactory: initAuth,
      deps: [AuthService],
      multi: true,
    },
    provideStore({
      confirmModal: confirmModalReducer,
    }),
    provideEffects([ConfirmModalEffects]),
  ],
};
