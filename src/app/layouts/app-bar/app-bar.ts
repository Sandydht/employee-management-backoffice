import { Component, inject } from '@angular/core';
import { SideBarService } from '../../core/services/side-bar-service/side-bar-service';
import { AuthService } from '../../core/services/auth-service/auth-service';

@Component({
  selector: 'app-app-bar',
  imports: [],
  templateUrl: './app-bar.html',
  styleUrl: './app-bar.css',
})
export class AppBarComponent {
  authService = inject(AuthService);
  sideBarService = inject(SideBarService);

  open(): void {
    this.sideBarService.open();
  }
}
