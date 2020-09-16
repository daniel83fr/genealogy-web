import { Injectable, Inject, PLATFORM_ID, APP_ID } from '@angular/core';
import { GraphQLService } from './GraphQLService';
import { Router } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_API = makeStateKey('api');

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {

  endpoint: string;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private api: GraphQLService,
    private router: Router
  ) {
    this.endpoint = this.state.get(STATE_KEY_API, '');
  }

  login(login: string, password: string) {
    return new Promise((resolve, reject) => this.api.login(this.endpoint.toString(), login, password)
      .then((auth) => {
        if (auth.success === true) {
          localStorage.setItem('token', auth.token.toString());
          resolve(auth.token);
          this.router.navigateByUrl('profile/' + this.getConnectedProfile());
          return;
        }
        throw new Error('Login failed.');
      })
      .catch((err) => {
        reject(Error(err));
      }));
  }

  register(email: string, password: string) {
    return new Promise((resolve, reject) => this.api.register(this.endpoint, email, password)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(Error(err));
      }));
  }

  logout() {
    localStorage.removeItem('token');
    //this.router.navigateByUrl('login');
  }

  isConnected() {
    const token = this.getToken();
    if (token == null) {
      return false;
    }
    const data = this.parseJwt(token);
    const hasExpired =  new Date(data.exp * 1000)  <= new Date();
    if (hasExpired) {
      localStorage.removeItem('token');
      return false;
    }

    return true;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getConnectedLogin() {
    if (this.isConnected) {
      const token = this.getToken();
      const data = this.parseJwt(token);
      return data.login;
    }
    return '';
  }

  getConnectedProfile() {
    if (this.isConnected) {
      const token = this.getToken();
      const data = this.parseJwt(token);
      return data.profile;
    }
    return '';
  }

  parseJwt(token) {
    if (token == null) {
      return {};
    }
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }
}
