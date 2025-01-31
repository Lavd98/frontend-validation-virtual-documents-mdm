import { Component, Input } from '@angular/core';
import { LoginData } from '../../interfaces/login.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  name: string = '';
  lastName: string = '';
  isAdmin: boolean = false;

  loginData: LoginData = (() => {
    const user = localStorage.getItem('user');
    if (!user) this.router.navigate(['/login']);
    return user ? JSON.parse(user) : { Token: undefined, User: {} };
  })();

  constructor(private router: Router) {
    this.name = this.loginData.User?.Name || '';
    this.lastName = this.loginData.User?.LastName || '';
    this.isAdmin = this.loginData.User?.Profile === 'Admin';
  }

  logout() {
    localStorage.removeItem('user');
    location.href = 'login';
  }
}
