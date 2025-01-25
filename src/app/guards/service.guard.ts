import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TokenExpiredDialogComponent } from '../pages/token-expired-dialog/token-expired-dialog.component';
import { LoginData } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceGuard implements CanActivate {
  loginData: LoginData = (() => {
    const user = localStorage.getItem('user');
    if (!user) this.router.navigate(['/login']);
    return user ? JSON.parse(user) : { Token: undefined, User: {} };
  })();

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  async canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.authService.isTokenValid().subscribe((isValid) => {
        const { data } = isValid;
        if (!data.Valid && data.Expired) {
          const dialogRef = this.dialog.open(TokenExpiredDialogComponent, {
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((result: any) => {
            if (result === 'continue') {
              try {
                debugger;
                this.authService
                  .newToken(this.loginData.Token)
                  .subscribe(({ data }) => {
                    localStorage.setItem('user', JSON.stringify(data));
                    resolve(true);
                  });
              } catch (error) {
                this.router.navigate(['/login']);
                resolve(false);
              }
            } else {
              this.router.navigate(['/login']);
              resolve(false);
            }
          });
        } else {
          resolve(true);
        }
      });
    });
  }
}
