import { createAction, props } from '@ngrx/store';

export const openConfirmModal = createAction(
  '[Confirm Modal] Open',
  props<{
    title: string;
    message: string;
    onConfirmAction: (() => void) | null;
  }>(),
);

export const closeConfirmModal = createAction('[Confirm Modal] Close');

export const confirmAccepted = createAction('[Confirm Modal] Accepted');

export const confirmRejected = createAction('[Confirm Modal] Rejected');
