import { Component, forwardRef, input, computed } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-search',
  imports: [],
  templateUrl: './input-search.html',
  styleUrl: './input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSearchComponent),
      multi: true,
    },
  ],
})
export class InputSearchComponent implements ControlValueAccessor {
  id = input('');
  placeholder = input('');
  disabled = input(false);

  internalValue = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.internalValue = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.internalValue = val;
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }

  inputClasses = computed(() => {
    const base = 'w-full pr-4 py-2 pl-12 rounded-lg border text-sm outline-none transition';

    const normal = `
      border-[var(--color-quaternary)]
      focus:border-[var(--color-primary)]
      focus:ring-2
      focus:ring-[var(--color-primary-light)]
    `;

    const disabledStyle = `
      bg-[var(--color-disabled-bg)]
      text-[var(--color-disabled-text)]
      cursor-not-allowed
      opacity-70
    `;

    if (this.disabled()) return `${base} ${disabledStyle}`;

    return `${base} ${normal}`;
  });

  searchIconClasses = computed(() => {
    return `
      absolute left-4 top-1/2 -translate-y-1/2
      w-6 h-6 flex items-center justify-center
      rounded-md
    `;
  });
}
