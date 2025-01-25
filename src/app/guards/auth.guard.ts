import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const { data } = await this.authService.isTokenValid().toPromise();
      if (data.valid && !data.expired) {
        this.router.navigate(['/dashboard/documents']);
        return false;
      } else {
        localStorage.removeItem('user');
        return true;
      }
    } catch (err) {
      console.error('Error validating token:', err);
      localStorage.removeItem('user');
      return true;
    }
  }
}
