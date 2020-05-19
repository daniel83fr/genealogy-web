import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
  })

export class NotificationService {

    duration = 3000;
    constructor(
        private snackBar: MatSnackBar) {

        }

    showInfo(text: string) {
        this.snackBar.open(text,
        'close', { duration: this.duration , panelClass: ['info-snackbar']});
    }

}
