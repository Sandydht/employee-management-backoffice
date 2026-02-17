import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ClickOutsideDirective } from '../../directives/click-outside/click-outside';
import { CalendarDay } from '../../models/calendar-day.model';
import { DateYMDPipe } from '../../pipes/date-ymd-pipe/date-ymd-pipe';

@Component({
  selector: 'app-input-date',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './input-date.html',
  styleUrl: './input-date.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
})
export class InputDateComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
  private readonly dateYMD = inject(DateYMDPipe);

  id = input<string>('');
  label = input<string>('Datepicker');
  placeholder = input<string>('Choose Date');
  error = input<string>('');
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  disabledInput = input<boolean>(false);

  disabledState = signal(false);

  disabled = computed(() => this.disabledInput() || this.disabledState());

  valueChange = output<string>();
  selectedDate = signal<Date | null>(null);

  openDropdown = signal(false);

  today = new Date();
  currentMonth = signal(this.today.getMonth());
  currentYear = signal(this.today.getFullYear());

  dropdownPosition = signal<'bottom' | 'top'>('bottom');

  @ViewChild('triggerBtn')
  triggerBtn!: ElementRef<HTMLButtonElement>;

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(2025, i, 1)),
  );

  years = computed(() => {
    const selected = this.selectedDate();

    // kalau sudah ada tanggal terpilih → jadikan anchor
    const anchorYear = selected ? selected.getFullYear() : new Date().getFullYear();

    const min = this.minDate()?.getFullYear() ?? anchorYear - 50;
    const max = this.maxDate()?.getFullYear() ?? anchorYear + 10;

    const result: number[] = [];

    for (let y = min; y <= max; y++) {
      result.push(y);
    }

    return result;
  });

  // =========================
  // INPUT CLASSES
  // =========================
  inputClasses = computed(() => {
    const base =
      'w-full px-4 py-2 rounded-lg border text-sm outline-none transition flex items-center justify-start';

    const normal = `
      border-[var(--color-quaternary)]
      focus:border-[var(--color-primary)]
      focus:ring-2
      focus:ring-[var(--color-primary-light)]
      cursor-pointer
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

    const emptyStyle = `
      text-[#A0A0A0]
    `;

    if (this.disabled()) return `${base} ${disabledStyle}`;
    if (this.error()) return `${base} ${errorStyle}`;
    if (!this.selectedDate()) return `${base} ${normal} ${emptyStyle}`;

    return `${base} ${normal}`;
  });

  // =========================
  // CVA CALLBACKS
  // =========================
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  parseDate(value: string | null): Date | null {
    if (!value) return null;

    const clean = value.split('T')[0];
    const parts = clean.split('-');

    if (parts.length !== 3) return null;

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (!year || !month || !day) return null;

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // =========================
  // MONTH OFFSET RESOLVER
  // =========================
  resolveMonthYear(offset: number): { month: number; year: number } {
    const date = new Date(this.currentYear(), this.currentMonth() + offset);
    return { month: date.getMonth(), year: date.getFullYear() };
  }

  // =========================
  // CALENDAR DAYS
  // =========================
  days = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const result: CalendarDay[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({ day: prevMonthDays - i, monthOffset: -1 });
    }

    for (let i = 1; i <= totalDays; i++) {
      result.push({ day: i, monthOffset: 0 });
    }

    while (result.length < 42) {
      result.push({
        day: result.length - (firstDay + totalDays) + 1,
        monthOffset: 1,
      });
    }

    return result;
  });

  // =========================
  // CVA METHODS
  // =========================
  writeValue(value: string | null): void {
    const date = this.parseDate(value);

    this.selectedDate.set(date);

    if (date) {
      queueMicrotask(() => {
        this.currentMonth.set(date.getMonth());
        this.currentYear.set(date.getFullYear());
      });
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  // =========================
  // NAVIGATION LIMITS
  // =========================
  canNavigateTo(month: number, year: number): boolean {
    const min = this.minDate();
    const max = this.maxDate();

    const target = new Date(year, month, 1);

    if (min) {
      const minMonth = new Date(min.getFullYear(), min.getMonth(), 1);
      if (target < minMonth) return false;
    }

    if (max) {
      const maxMonth = new Date(max.getFullYear(), max.getMonth(), 1);
      if (target > maxMonth) return false;
    }

    return true;
  }

  canGoNext = computed(() => {
    let m = this.currentMonth();
    let y = this.currentYear();

    if (m === 11) {
      m = 0;
      y++;
    } else {
      m++;
    }

    return this.canNavigateTo(m, y);
  });

  canGoPrev = computed(() => {
    let m = this.currentMonth();
    let y = this.currentYear();

    if (m === 0) {
      m = 11;
      y--;
    } else {
      m--;
    }

    return this.canNavigateTo(m, y);
  });

  nextMonth(): void {
    if (!this.canGoNext()) return;

    let m = this.currentMonth();
    let y = this.currentYear();

    if (m === 11) {
      m = 0;
      y++;
    } else {
      m++;
    }

    this.currentMonth.set(m);
    this.currentYear.set(y);
  }

  prevMonth(): void {
    if (!this.canGoPrev()) return;

    let m = this.currentMonth();
    let y = this.currentYear();

    if (m === 0) {
      m = 11;
      y--;
    } else {
      m--;
    }

    this.currentMonth.set(m);
    this.currentYear.set(y);
  }

  // =========================
  // MONTH/YEAR CHANGE (SYNC FIX)
  // =========================
  onMonthChange(event: Event): void {
    const month = Number((event.target as HTMLSelectElement).value);

    this.currentMonth.set(month);

    const selected = this.selectedDate();
    if (!selected) return;

    const day = selected.getDate();
    const maxDay = new Date(this.currentYear(), month + 1, 0).getDate();
    const safeDay = Math.min(day, maxDay);

    const newDate = new Date(this.currentYear(), month, safeDay);

    this.selectedDate.set(newDate);

    const formatted = this.dateYMD.transform(newDate);
    this.onChange(formatted);
    this.valueChange.emit(formatted);
  }

  onYearChange(event: Event): void {
    const year = Number((event.target as HTMLSelectElement).value);

    this.currentYear.set(year);

    const selected = this.selectedDate();
    if (!selected) return;

    const month = this.currentMonth();
    const day = selected.getDate();

    const maxDay = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(day, maxDay);

    const newDate = new Date(year, month, safeDay);

    this.selectedDate.set(newDate);

    const formatted = this.dateYMD.transform(newDate);
    this.onChange(formatted);
    this.valueChange.emit(formatted);
  }

  isMonthDisabled(month: number): boolean {
    const year = this.currentYear();
    const min = this.minDate();
    const max = this.maxDate();

    if (min && year === min.getFullYear() && month < min.getMonth()) return true;

    if (max && year === max.getFullYear() && month > max.getMonth()) return true;

    return false;
  }

  isYearDisabled(year: number): boolean {
    const min = this.minDate();
    const max = this.maxDate();

    if (min && year < min.getFullYear()) return true;
    if (max && year > max.getFullYear()) return true;

    return false;
  }

  // =========================
  // SELECT DATE
  // =========================
  selectDate(item: CalendarDay): void {
    if (this.isDisabledDate(item)) return;

    const { month, year } = this.resolveMonthYear(item.monthOffset);

    this.currentMonth.set(month);
    this.currentYear.set(year);

    const dateObj = new Date(year, month, item.day);

    this.selectedDate.set(dateObj);

    const formatted = this.dateYMD.transform(dateObj);

    this.valueChange.emit(formatted);
    this.onChange(formatted);
    this.onTouched();

    this.closeDropdown();
  }

  // =========================
  // HELPERS
  // =========================
  normalize(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  isDisabledDate(item: CalendarDay): boolean {
    const { month, year } = this.resolveMonthYear(item.monthOffset);

    const date = this.normalize(new Date(year, month, item.day));

    const min = this.minDate() ? this.normalize(this.minDate()!) : null;
    const max = this.maxDate() ? this.normalize(this.maxDate()!) : null;

    if (min && date < min) return true;
    if (max && date > max) return true;

    return false;
  }

  isSelected(item: CalendarDay): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;

    const { month, year } = this.resolveMonthYear(item.monthOffset);

    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === item.day
    );
  }

  isToday(item: CalendarDay): boolean {
    const now = new Date();

    const { month, year } = this.resolveMonthYear(item.monthOffset);

    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === item.day;
  }

  // =========================
  // DROPDOWN
  // =========================
  toggleDropdown(): void {
    if (this.disabled()) return;

    this.openDropdown.update((v) => !v);

    if (this.openDropdown()) {
      const selected = this.selectedDate();
      if (selected) {
        this.currentMonth.set(selected.getMonth());
        this.currentYear.set(selected.getFullYear());
      }

      setTimeout(() => this.calculateDropdownPosition());
    }
  }

  closeDropdown(): void {
    this.openDropdown.set(false);
    this.onTouched();
  }

  calculateDropdownPosition(): void {
    const panelHeight = 360;
    const rect = this.triggerBtn.nativeElement.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    this.dropdownPosition.set(
      spaceBelow < panelHeight && spaceAbove > panelHeight ? 'top' : 'bottom',
    );
  }

  private resizeHandler = () => {
    if (this.openDropdown()) this.calculateDropdownPosition();
  };

  ngAfterViewInit(): void {
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }
}
