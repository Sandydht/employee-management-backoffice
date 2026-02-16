import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  clickOutside = output<void>();
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
