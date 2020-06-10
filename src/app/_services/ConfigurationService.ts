import { Injectable } from '@angular/core';
import { ClientCacheService } from './ClientCacheService';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ConfigurationService {

    constructor(
        private cacheService: ClientCacheService,
        private http: HttpClient) {

    }

    getVersion(): Promise<string> {
      return new Promise((resolve) => {
        resolve('v1.0.0-beta');
      });
    }

    getApiEndpoint(): Promise<string> {

        return new Promise((resolve, reject) => {

            const cachedEndpoint = this.cacheService.endpoint;
            if (cachedEndpoint != null) {
              resolve(cachedEndpoint);
            }

            const url = window.location.origin + '/env';
            fetch(url)
                .then((resp) => resp.json())
                .then(res => {
                    const endpoint: string = res.GENEALOGY_API;
                    this.cacheService.endpoint = endpoint;
                    resolve(endpoint);
                    return endpoint;
                }).catch(err => {
                    reject(Error(err));
                });
        });
    }

    getEnvironnement(): Promise<string> {

        return new Promise((resolve, reject) => {

            const cachedEnv = this.cacheService.environnement;
            if (cachedEnv != null) {
                resolve(cachedEnv);
            }

            const url = window.location.origin + '/env';
            fetch(url)
                .then((resp) => resp.json())
                .then(res => {
                    const env: string = res.Environnement;
                    this.cacheService.environnement = env;
                    resolve(env);
                    return env;
                }).catch(err => {
                    reject(Error(err));
                });
        });
    }
}
