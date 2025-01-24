import { Component } from '@angular/core';
import { LoginData, LoginResponse } from '../../interfaces/login.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User, UserBody } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  user: UserBody = {
    Username: '',
    Password: '',
  };

  constructor(private usuariosServices: AuthService, private router: Router) {}

  async onSubmit() {
    try {
      const response = await this.login(this.user);
      this.handleLoginResponse(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async login(user: UserBody): Promise<LoginResponse> {
    if (!user.Username || !user.Password) {
      await this.showErrorMessage('Por favor, ingrese un usuario y contraseña');
      return Promise.reject('Invalid user or password');
    }
    return firstValueFrom(
      this.usuariosServices.login(user?.Username, user?.Password)
    );
  }

  private async handleLoginResponse(response: LoginResponse) {
    if (response.code === 200 && response?.data && response?.data?.User) {
      this.storeUserData(response.data);
      await this.router.navigate(['/dashboard']);
    } else {
      await this.showErrorMessage(
        'El usuario no registrado en la base de datos'
      );
    }
  }

  private storeUserData(data: LoginData) {
    localStorage.setItem('user', JSON.stringify({ ...data }));
  }

  private async showErrorMessage(message: string) {
    await Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  private async handleError(error: any) {
    console.error('Error during login:', error);
    await this.showErrorMessage('Ocurrió un error durante el inicio de sesión');
  }
}
