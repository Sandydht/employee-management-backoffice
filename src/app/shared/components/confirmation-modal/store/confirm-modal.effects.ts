/* eslint-disable @typescript-eslint/no-unused-vars */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import * as ConfirmActions from './confirm-modal.actions';
import { selectConfirmModalState } from './confirm-modal.selectors';
import { withLatestFrom, tap } from 'rxjs/operators';

export class ConfirmModalEffects {
  actions$ = inject(Actions);
  store = inject(Store);

  confirm$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConfirmActions.confirmAccepted),
        withLatestFrom(this.store.select(selectConfirmModalState)),
        tap(([_, modal]) => {
          if (modal.onConfirmAction) {
            modal.onConfirmAction();
          }
          this.store.dispatch(ConfirmActions.closeConfirmModal());
        }),
      ),
    { dispatch: false },
  );
}
