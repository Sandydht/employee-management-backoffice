import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RupiahPipe } from '../../pipes/rupiah-pipe/rupiah-pipe-pipe';

@Component({
  selector: 'app-input-currency',
  templateUrl: './input-currency.html',
  styleUrl: './input-currency.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCurrencyComponent),
      multi: true,
    },
    RupiahPipe,
  ],
})
export class InputCurrencyComponent implements ControlValueAccessor {
  private readonly rupiahPipe = inject(RupiahPipe);

  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<number | null>();

  @ViewChild('currencyInput', { static: true })
  inputRef!: ElementRef<HTMLInputElement>;

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  private parse(value: string): number | null {
    const raw = value.replace(/\D/g, '');
    return raw.length > 0 ? Number(raw) : null;
  }

  writeValue(value: number | null): void {
    const inputEl = this.inputRef.nativeElement;

    if (value === null) {
      inputEl.value = '';
      return;
    }

    inputEl.value = this.rupiahPipe.transform(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.inputRef.nativeElement.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;

    const numberValue = this.parse(inputEl.value);

    if (numberValue !== null) {
      inputEl.value = this.rupiahPipe.transform(numberValue);
    } else {
      inputEl.value = '';
    }

    this.valueChange.emit(numberValue);
    this.onChange(numberValue);
  }

  handleBlur(): void {
    this.onTouched();
  }

  inputClasses = computed(() => {
    const base = 'w-full px-4 py-2 rounded-lg border text-sm outline-none transition';

    const normal = `
      border-[var(--color-quaternary)]
      focus:border-[var(--color-primary)]
      focus:ring-2
      focus:ring-[var(--color-primary-light)]
    `;

    const errorStyle = `
      border-[var(--color-danger)]
      focus:border-[var(--color-danger-dark)]
      focus:ring-2
      focus:ring-[var(--color-danger-light)]
    `;

    const disabledStyle = `
      bg-[var(--color-disabled-bg)]
      text-[var(--color-disabled-text)]
      cursor-not-allowed
      opacity-70
    `;

    if (this.disabled()) return `${base} ${disabledStyle}`;
    if (this.error()) return `${base} ${errorStyle}`;

    return `${base} ${normal}`;
  });
}
