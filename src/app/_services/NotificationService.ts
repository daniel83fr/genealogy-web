import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
  })

export class NotificationService {

    private duration = 3000;
    constructor(
        private snackBar: MatSnackBar) {

        }

    showInfo(text: string) {
        this.snackBar.open(text,
        'close', { duration: this.duration , panelClass: ['info-snackbar']});
    }

    showSuccess(text: string) {
        this.snackBar.open(text,
        'close', { duration: this.duration , panelClass: ['success-snackbar']});
    }

    showError(text: string) {
        this.snackBar.open(text,
        'close', { duration: this.duration , panelClass: ['error-snackbar']});
    }

    showWarning(text: string) {
        this.snackBar.open(text,
        'close', { duration: this.duration , panelClass: ['warn-snackbar']});
    }

}
