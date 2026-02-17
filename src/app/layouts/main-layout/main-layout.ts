import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../side-bar/side-bar';
import { AppBarComponent } from '../app-bar/app-bar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SideBarComponent, AppBarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
