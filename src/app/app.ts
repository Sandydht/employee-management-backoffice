import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal';
import { SnackbarComponent } from './shared/components/snackbar/snackbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmationModalComponent, SnackbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
