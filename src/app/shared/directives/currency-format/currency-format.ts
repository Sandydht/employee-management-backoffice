import { AfterViewInit, Directive, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { RupiahPipe } from '../../pipes/rupiah-pipe/rupiah-pipe-pipe';

@Directive({
  selector: '[appCurrencyFormat]',
  standalone: true,
})
export class CurrencyFormatDirective implements OnInit, AfterViewInit {
  private readonly ngControl = inject(NgControl);
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly rupiah = inject(RupiahPipe);

  ngOnInit() {
    const value = this.ngControl.control?.value;
    if (value !== null) {
      this.el.nativeElement.value = this.rupiah.transform(value);
    }
  }

  ngAfterViewInit() {
    queueMicrotask(() => {
      const value = this.ngControl.control?.value;
      if (value) {
        this.el.nativeElement.value = this.rupiah.transform(value);
      }
    });
  }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    const raw = input.value.replace(/\D/g, '');
    this.ngControl.control?.setValue(raw ? Number(raw) : null, { emitEvent: false });
    input.value = this.rupiah.transform(raw);
  }

  @HostListener('blur')
  onBlur() {
    this.onInput();
  }
}
