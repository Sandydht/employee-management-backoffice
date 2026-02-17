import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownDataOptions } from '../../models/dropdown-data-options.model';

@Component({
  selector: 'app-input-autocomplete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-autocomplete.html',
  styleUrl: './input-autocomplete.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputAutocompleteComponent),
      multi: true,
    },
  ],
})
export class InputAutocompleteComponent implements ControlValueAccessor, OnDestroy, AfterViewInit {
  id = input<string>('');
  label = input<string>('');
  placeholder = input<string>('Search...');
  disabled = input<boolean>(false);
  error = input<string>('');
  options = input<DropdownDataOptions[]>([]);

  valueChange = output<string>();

  searchText = signal('');
  debouncedText = signal('');
  selectedKey = signal('');
  isOpenDropdown = signal(false);

  dropdownPosition = signal<'bottom' | 'top'>('bottom');

  @ViewChild('triggerInput')
  triggerInput!: ElementRef<HTMLInputElement>;

  private debounceTimer?: ReturnType<typeof setTimeout>;
  private currentValue = '';

  filteredOptions = computed(() => {
    if (!this.debouncedText().trim()) return this.options();

    return this.options().filter((opt) =>
      opt.label.toLowerCase().includes(this.debouncedText().toLowerCase()),
    );
  });

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.currentValue = value;
    this.syncSelected();
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  constructor() {
    effect(() => {
      this.options();
      this.syncSelected();
    });
  }

  private syncSelected() {
    const selected = this.options().find((opt) => opt.key === this.currentValue);

    if (selected) {
      this.searchText.set(selected.label);
      this.debouncedText.set(selected.label);
      this.selectedKey.set(selected.key);
    }
  }

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.searchText.set(value);
    this.isOpenDropdown.set(true);

    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.debouncedText.set(value);
    }, 300);
  }

  selectOption(option: DropdownDataOptions) {
    this.searchText.set(option.label);
    this.selectedKey.set(option.key);

    this.currentValue = option.key;

    this.onChange(option.key);
    this.onTouched();

    this.valueChange.emit(option.key);

    this.closeDropdown();
  }

  openDropdown() {
    if (this.disabled()) return;

    this.isOpenDropdown.set(true);
    setTimeout(() => this.calculateDropdownPosition());
  }

  closeDropdown() {
    this.isOpenDropdown.set(false);
  }

  calculateDropdownPosition() {
    const panelHeight = Math.min(this.filteredOptions().length * 40, 200);

    const rect = this.triggerInput.nativeElement.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    this.dropdownPosition.set(
      spaceBelow < panelHeight && spaceAbove > panelHeight ? 'top' : 'bottom',
    );
  }

  private resizeHandler = () => {
    if (this.isOpenDropdown()) this.calculateDropdownPosition();
  };

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    window.removeEventListener('resize', this.resizeHandler);
  }

  inputClasses = computed(() => {
    const base = 'w-full px-4 py-2 rounded-lg border text-sm outline-none transition';

    if (this.disabled()) return `${base} bg-gray-100 text-gray-400 cursor-not-allowed`;

    if (this.error()) return `${base} border-red-400 focus:ring-red-200`;

    return `${base} border-gray-300 focus:ring-2 focus:ring-blue-200`;
  });

  iconClasses = computed(() => {
    return `
      absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition
      ${this.isOpenDropdown() ? 'rotate-180' : ''}
    `;
  });
}
