import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-token-expired-dialog',
  templateUrl: './token-expired-dialog.component.html',
  styleUrl: './token-expired-dialog.component.css',
})
export class TokenExpiredDialogComponent {
  constructor(private dialogRef: MatDialogRef<TokenExpiredDialogComponent>) {}

  onContinue() {
    this.dialogRef.close('continue');
  }

  onLogout() {
    this.dialogRef.close('logout');
  }
}
