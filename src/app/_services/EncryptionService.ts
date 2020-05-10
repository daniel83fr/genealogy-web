import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class EncryptionService {
    encryptPassword(password) {
        return password
    }
}