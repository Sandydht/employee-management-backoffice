import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside/click-outside';
import { CommonModule } from '@angular/common';
import { CalendarDay } from '../../models/calendar-day.model';

@Component({
  selector: 'app-input-date',
  imports: [ClickOutsideDirective, CommonModule],
  templateUrl: './input-date.html',
  styleUrl: './input-date.css',
})
export class InputDateComponent implements AfterViewInit {
  id = input<string>('');
  label = input<string>('Datepicker');
  placeholder = input<string>('Choose Date');
  disabled = input<boolean>(false);
  error = input<string>('');
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(new Date());

  @ViewChild('dropdownPanel')
  dropdownPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('triggerBtn')
  triggerBtn!: ElementRef<HTMLButtonElement>;
  openDropdown = signal<boolean>(false);

  today = new Date();

  currentMonth = signal<number>(this.today.getMonth());
  currentYear = signal<number>(this.today.getFullYear());
  selectedDate = signal<Date | null>(null);
  dropdownPosition = signal<'bottom' | 'top'>('bottom');

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  years = computed(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => now - 25 + i);
  });

  days = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const result: CalendarDay[] = [];

    // Bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      result.push({
        day: prevMonthDays - i,
        monthOffset: -1,
      });
    }

    // Bulan sekarang
    for (let i = 1; i <= totalDays; i++) {
      result.push({
        day: i,
        monthOffset: 0,
      });
    }

    // Bulan berikutnya
    while (result.length < 42) {
      result.push({
        day: result.length - (firstDay + totalDays) + 1,
        monthOffset: 1,
      });
    }

    return result;
  });

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

    if (this.disabled()) return `${base} ${disabledStyle}`;
    if (this.error()) return `${base} ${errorStyle}`;

    return `${base} ${normal}`;
  });

  canGoNext = computed(() => {
    let month = this.currentMonth();
    let year = this.currentYear();

    if (month === 11) {
      month = 0;
      year++;
    } else {
      month++;
    }

    return this.canNavigateTo(month, year);
  });

  canGoPrev = computed(() => {
    let month = this.currentMonth();
    let year = this.currentYear();

    if (month === 0) {
      month = 11;
      year--;
    } else {
      month--;
    }

    return this.canNavigateTo(month, year);
  });

  ngAfterViewInit() {
    window.addEventListener('resize', () => {
      if (this.openDropdown()) {
        this.calculateDropdownPosition();
      }
    });
  }

  nextMonth(): void {
    let month = this.currentMonth();
    let year = this.currentYear();

    // hitung target month/year
    if (month === 11) {
      month = 0;
      year++;
    } else {
      month++;
    }

    // stop kalau melewati maxDate
    if (!this.canNavigateTo(month, year)) return;

    this.currentMonth.set(month);
    this.currentYear.set(year);
  }

  prevMonth(): void {
    let month = this.currentMonth();
    let year = this.currentYear();

    // hitung target month/year
    if (month === 0) {
      month = 11;
      year--;
    } else {
      month--;
    }

    // stop kalau melewati minDate
    if (!this.canNavigateTo(month, year)) return;

    this.currentMonth.set(month);
    this.currentYear.set(year);
  }

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

  selectDate(item: CalendarDay): void {
    if (this.isDisabledDate(item)) return;

    // Hitung month/year target
    let month = this.currentMonth() + item.monthOffset;
    let year = this.currentYear();

    // Adjust kalau overflow
    if (month < 0) {
      month = 11;
      year--;
    }

    if (month > 11) {
      month = 0;
      year++;
    }

    // Set calendar view ke bulan baru
    this.currentMonth.set(month);
    this.currentYear.set(year);

    // Set selected date
    const date = new Date(year, month, item.day);

    this.selectedDate.set(date);

    this.closeDropdown();
  }

  isSelected(item: CalendarDay): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;

    const month = this.currentMonth() + item.monthOffset;
    const year = this.currentYear();

    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === item.day
    );
  }

  isToday(item: CalendarDay): boolean {
    const now = new Date();

    return (
      now.getFullYear() === this.currentYear() &&
      now.getMonth() === this.currentMonth() &&
      now.getDate() === item.day
    );
  }

  normalize(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  isDisabledDate(item: { day: number; monthOffset: -1 | 0 | 1 }): boolean {
    const month = this.currentMonth() + item.monthOffset;
    const year = this.currentYear();

    const date = this.normalize(new Date(year, month, item.day));

    const min = this.minDate() ? this.normalize(this.minDate()!) : null;
    const max = this.maxDate() ? this.normalize(this.maxDate()!) : null;

    if (min && date < min) return true;
    if (max && date > max) return true;

    return false;
  }

  toggleDropdown(): void {
    this.openDropdown.update((value) => !value);

    if (!this.openDropdown()) return;

    const selected = this.selectedDate();

    if (selected) {
      this.currentMonth.set(selected.getMonth());
      this.currentYear.set(selected.getFullYear());
    }

    setTimeout(() => {
      this.calculateDropdownPosition();
    });
  }

  closeDropdown(): void {
    this.openDropdown.set(false);
  }

  calculateDropdownPosition(): void {
    const panelHeight = 360; // estimasi tinggi dropdown
    const rect = this.triggerBtn.nativeElement.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.top;
    const spaceAbove = rect.top;

    if (spaceBelow < panelHeight && spaceAbove > panelHeight) {
      this.dropdownPosition.set('top');
    } else {
      this.dropdownPosition.set('bottom');
    }
  }

  onMonthChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);

    this.currentMonth.set(value);

    // kalau selectedDate ada, update juga biar sync
    const selected = this.selectedDate();
    if (selected) {
      this.selectedDate.set(new Date(this.currentYear(), value, selected.getDate()));
    }
  }

  onYearChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);

    this.currentYear.set(value);

    const selected = this.selectedDate();
    if (selected) {
      this.selectedDate.set(new Date(value, this.currentMonth(), selected.getDate()));
    }
  }

  isMonthDisabled(month: number): boolean {
    const year = this.currentYear();

    const min = this.minDate();
    const max = this.maxDate();

    if (min && year === min.getFullYear() && month < min.getMonth()) {
      return true;
    }

    if (max && year === max.getFullYear() && month > max.getMonth()) {
      return true;
    }

    return false;
  }

  isYearDisabled(year: number): boolean {
    const min = this.minDate();
    const max = this.maxDate();

    if (min && year < min.getFullYear()) return true;
    if (max && year > max.getFullYear()) return true;

    return false;
  }
}
