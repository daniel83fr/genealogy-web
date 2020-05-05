import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { ClientCacheService } from './ClientCacheService';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ConfigurationService {

    constructor(
        private cacheService: ClientCacheService,
        private http: HttpClient) {

    }

    getApiEndpoint(): Observable<any> {

        var cachedEndpoint = this.cacheService.endpoint
        if (cachedEndpoint != null) {
            return of(cachedEndpoint)
        }

        return this.http.get(window.location.origin + '/info/api').pipe(
            map(res => {
                let endpoint = res["GENEALOGY_API"]
                this.cacheService.endpoint = endpoint
                console.debug(`Endpoint: ${endpoint}`)
                return endpoint;
            }));
    }

    getEnvironnement(): Observable<any> {
        const cachedEnv = this.cacheService.environnement
        if (cachedEnv != null) {
            return of(cachedEnv)
        }

        return this.http.get('/info/env').pipe(
            map(res => {
                let env = res["Environnement"]
                this.cacheService.environnement = env;
                console.debug(`Env: ${env}`)
                return env;
            }));
    }
}