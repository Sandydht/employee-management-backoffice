import { Component, inject, effect } from '@angular/core';
import { ButtonComponent } from '../button/button';
import { Store } from '@ngrx/store';
import { selectModalData } from './store/confirm-modal.selectors';
import * as ConfirmActions from './store/confirm-modal.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
})
export class ConfirmationModalComponent {
  private readonly store = inject(Store);

  modal$ = this.store.select(selectModalData);

  constructor() {
    effect(() => {
      this.modal$.subscribe((modal) => {
        document.body.style.overflow = modal.isOpen ? 'hidden' : 'unset';
      });
    });
  }

  confirm() {
    this.store.dispatch(ConfirmActions.confirmAccepted());
  }

  cancel() {
    this.store.dispatch(ConfirmActions.confirmRejected());
    this.store.dispatch(ConfirmActions.closeConfirmModal());
  }
}
