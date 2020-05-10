import { Injectable } from '@angular/core';
import { GraphQLService } from './GraphQLService';
import { ConfigurationService } from './ConfigurationService';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
        private rest: ConfigurationService,
        private api: GraphQLService,
  ) {
  }

  login(login: string, password: string) {
    return new Promise((resolve, reject) => this.rest.getApiEndpoint()
      .then((endpoint) => this.api.login(endpoint.toString(), login, password))
      .then((auth) => {
        if (auth.success === true) {
          resolve(auth.token);
          return;
        }
        throw new Error('Login failed.');
      })
      .catch((err) => {
        reject(Error(err));
      }));
  }

  register(id: string, login: string, password: string) {
    return new Promise((resolve, reject) => this.rest.getApiEndpoint()
      .then((endpoint) => this.api.register(endpoint.toString(), id, login, password))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(Error(err));
      }));
  }
}
