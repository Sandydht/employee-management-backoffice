import { AfterViewInit, Directive, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormat]',
  standalone: true,
})
export class CurrencyFormatDirective implements OnInit, AfterViewInit {
  private readonly ngControl = inject(NgControl);
  private readonly el = inject(ElementRef<HTMLInputElement>);

  ngOnInit() {
    const value = this.ngControl.control?.value;
    if (value !== null) {
      this.el.nativeElement.value = this.formatCurrency(value);
    }
  }

  ngAfterViewInit() {
    queueMicrotask(() => {
      const value = this.ngControl.control?.value;
      if (value) {
        this.el.nativeElement.value = this.formatCurrency(value);
      }
    });
  }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;

    const raw = input.value.replace(/\D/g, '');

    this.ngControl.control?.setValue(raw ? Number(raw) : null, { emitEvent: false });

    input.value = this.formatCurrency(raw);
  }

  @HostListener('blur')
  onBlur() {
    this.onInput();
  }

  public formatCurrency(value: number): string {
    return value ? `Rp ${new Intl.NumberFormat('id-ID').format(Number(value))}` : '';
  }
}
