import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  isOpen = signal<boolean>(false);

  open(): void {
    document.body.style.overflow = 'hidden';
    this.isOpen.set(true);
  }

  close(): void {
    document.body.style.overflow = 'unset';
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((value) => !value);
  }
}
