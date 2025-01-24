import { Component, Input } from '@angular/core';
import { LoginData } from '../../interfaces/login.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  name: string = '';
  lastName: string = '';

  loginData: LoginData = JSON.parse(
    localStorage.getItem('user') || '{ Token: "", User: {} }'
  );

  constructor() {
    this.name = this.loginData.User?.Name || '';
    this.lastName = this.loginData.User?.LastName || '';
  }

  logout() {
    localStorage.removeItem('user');
    location.href = 'login';
  }
}
