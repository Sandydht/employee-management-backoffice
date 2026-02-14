import { Component, inject } from '@angular/core';
import { SideBarService } from '../../core/services/side-bar-service/side-bar-service';

@Component({
  selector: 'app-app-bar',
  imports: [],
  templateUrl: './app-bar.html',
  styleUrl: './app-bar.css',
})
export class AppBarComponent {
  sideBarService = inject(SideBarService);

  open(): void {
    this.sideBarService.open();
  }
}
