import { Component, input, computed, signal, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-password',
  standalone: true,
  templateUrl: './input-password.html',
  styleUrl: './input-password.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements ControlValueAccessor {
  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  error = input<string>('');

  internalValue = signal<string>('');

  visible = signal<boolean>(false);

  toggleVisibility(): void {
    if (this.disabled()) return;
    this.visible.update((v) => !v);
  }

  actualType = computed(() => (this.visible() ? 'text' : 'password'));

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.internalValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.onTouched();
  }

  inputClasses = computed(() => {
    const base = 'w-full pl-4 py-2 pr-12 rounded-lg border text-sm outline-none transition';

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

  eyeButtonClasses = computed(() => {
    return `
      absolute right-4 top-1/2 -translate-y-1/2
      w-6 h-6 flex items-center justify-center
      rounded-md
      ${this.disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'}
    `;
  });
}
