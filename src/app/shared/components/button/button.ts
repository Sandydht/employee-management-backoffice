import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outlinePrimary';
export type ButtonType = 'button' | 'submit';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<ButtonType>('button');

  classes = computed(() => {
    const base =
      'w-full h-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-center text-[14px] leading-5 font-bold line-clamp-1 text-nowrap';

    const variants: Record<ButtonVariant, string> = {
      primary: `
        bg-[var(--color-primary)]
        text-white
        hover:bg-[var(--color-primary-light)]
        active:bg-[var(--color-primary-dark)]
        cursor-pointer
      `,
      secondary: `
        bg-[var(--color-secondary)]
        text-white
        hover:bg-[var(--color-secondary-light)]
        active:bg-[var(--color-secondary-dark)]
        cursor-pointer
      `,
      danger: `
        bg-[var(--color-danger)]
        text-white
        hover:bg-[var(--color-danger-dark)]
        active:bg-[var(--color-danger-dark)]
        cursor-pointer
      `,
      outlinePrimary: `
        bg-transparent
        border-2
        border-[var(--color-primary)]
        text-[var(--color-primary)]
        hover:bg-gray-100
        hover:text-primary
        cursor-pointer
      `,
    };

    const disabledStyle = `
      bg-[var(--color-disabled-bg)]
      text-[var(--color-disabled-text)]
      cursor-not-allowed
      opacity-70
    `;

    if (this.disabled() || this.loading()) {
      return `${base} ${disabledStyle}`;
    }

    return `${base} ${variants[this.variant()]}`;
  });
}
