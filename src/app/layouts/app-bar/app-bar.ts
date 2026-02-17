import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-service/auth-service';
import { Store } from '@ngrx/store';
import * as SidebarActions from '../side-bar/store/sidebar.actions';

@Component({
  selector: 'app-app-bar',
  imports: [],
  templateUrl: './app-bar.html',
  styleUrl: './app-bar.css',
})
export class AppBarComponent {
  authService = inject(AuthService);
  store = inject(Store);

  open(): void {
    this.store.dispatch(SidebarActions.openSidebar());
  }
}
