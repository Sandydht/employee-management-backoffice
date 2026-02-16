import { Component, computed, inject } from '@angular/core';
import { SideBarService } from '../../core/services/side-bar-service/side-bar-service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button';
import { Store } from '@ngrx/store';
import * as ConfirmActions from '../../shared/components/confirmation-modal/store/confirm-modal.actions';
import { AuthService } from '../../core/services/auth-service/auth-service';

type SidebarLink = {
  label: string;
  path: string;
};

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, ButtonComponent],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBarComponent {
  sideBarService = inject(SideBarService);
  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);

  links: SidebarLink[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      label: 'Employees',
      path: '/employees',
    },
  ];

  close(): void {
    this.sideBarService.close();
  }

  sideBarClasses = computed(() => {
    const base =
      'w-full h-auto max-w-[15rem] min-w-[15rem] flex flex-col items-start justify-start fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200 shadow-md z-50 transform transition-transform duration-200';

    const openStyle = 'translate-x-0';
    const closeStyle = '-translate-x-full lg:translate-x-0';

    if (this.sideBarService.isOpen()) return `${base} ${openStyle}`;

    return `${base} ${closeStyle}`;
  });

  openConfirmationModalBox(): void {
    this.store.dispatch(
      ConfirmActions.openConfirmModal({
        title: 'Logout',
        message: 'Are you sure you want to log out?',
        onConfirmAction: () => {
          this.authService.logout();
        },
      }),
    );
  }
}
