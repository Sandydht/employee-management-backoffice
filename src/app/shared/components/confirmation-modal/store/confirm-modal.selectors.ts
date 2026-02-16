import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConfirmModalState } from './confirm-modal.state';

export const selectConfirmModalState = createFeatureSelector<ConfirmModalState>('confirmModal');

export const selectIsOpen = createSelector(selectConfirmModalState, (state) => state.isOpen);

export const selectModalData = createSelector(selectConfirmModalState, (state) => state);
