import { Component, computed, inject } from '@angular/core';
import { SideBarService } from '../../core/services/side-bar-service/side-bar-service';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBarComponent {
  sideBarService = inject(SideBarService);

  close(): void {
    this.sideBarService.close();
  }

  sideBarClasses = computed(() => {
    const base =
      'w-full h-full min-w-[250px] max-w-[250px] min-h-screen max-h-screen overflow-y-auto flex flex-col items-start justify-start fixed left-0 top-0 bottom-0 z-40 border-r border-gray-100 shadow-md bg-white transform transition-transform duration-200 md:translate-x-0 md:static';

    const openStyle = 'translate-x-0';
    const closeStyle = '-translate-x-full';

    if (this.sideBarService.isOpen()) return `${base} ${openStyle}`;

    return `${base} ${closeStyle}`;
  });
}
