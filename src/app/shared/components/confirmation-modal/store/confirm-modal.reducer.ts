import { createReducer, on } from '@ngrx/store';
import * as ConfirmActions from './confirm-modal.actions';
import { initialConfirmModalState } from './confirm-modal.state';

export const confirmModalReducer = createReducer(
  initialConfirmModalState,

  on(ConfirmActions.openConfirmModal, (state, payload) => ({
    ...state,
    isOpen: true,
    title: payload.title,
    message: payload.message,
    onConfirmAction: payload.onConfirmAction,
  })),

  on(ConfirmActions.closeConfirmModal, () => initialConfirmModalState),
);
