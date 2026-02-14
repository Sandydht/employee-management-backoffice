import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event.target'])
  public onClick(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;

    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
