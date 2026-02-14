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
      'w-full h-full min-w-[250px] max-w-[250px] lg:translate-x-0 lg:static min-h-screen max-h-screen flex flex-col items-start justify-start fixed left-0 top-0 bottom-0 z-40 border-r border-gray-100 shadow-md bg-white transform transition-transform duration-200';

    const openStyle = 'translate-x-0';
    const closeStyle = '-translate-x-full lg:translate-x-0';

    if (this.sideBarService.isOpen()) return `${base} ${openStyle}`;

    return `${base} ${closeStyle}`;
  });
}
