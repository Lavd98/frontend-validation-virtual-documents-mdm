import { Component } from '@angular/core';
import { LoginData } from '../../interfaces/login.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  profile: string = '';

  loginData: LoginData = JSON.parse(localStorage.getItem('user') || '{}');

  constructor() {
    this.profile = this.loginData.User?.Profile || '';
  }
}
