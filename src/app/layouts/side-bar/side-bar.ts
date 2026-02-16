import { Component, computed, inject } from '@angular/core';
import { SideBarService } from '../../core/services/side-bar-service/side-bar-service';
import { RouterModule } from '@angular/router';

type SidebarLink = {
  label: string;
  path: string;
};

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBarComponent {
  sideBarService = inject(SideBarService);

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
}
