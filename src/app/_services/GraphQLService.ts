import { Injectable } from '@angular/core';
import { Subject, Observable, from, of } from 'rxjs';
import { createApolloFetch } from 'apollo-fetch';
import { ClientCacheService } from './ClientCacheService';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class GraphQLService {

    constructor(private cacheService: ClientCacheService) {

    }

    shouldResetPersonCache(endpoint: string): Observable<any> {

        if (this.cacheService.personsList == null) {
            return of(false)
        }

        let dte = this.cacheService.personsList.timestamp

        const fetch = createApolloFetch({
            uri: endpoint,
        });
        var promise = fetch({
            query: `query shouldResetCache {
                shouldResetCache(lastEntry: "${dte}")
              }
              
          `,
        })

        return from(promise);
    }

    getPersonList(endpoint: string): Observable<any> {

        this.shouldResetPersonCache(endpoint).subscribe(res => {
            if(res)
            {
                this.cacheService.clearPersonsList()
            }

            if (this.cacheService.personsList != null) {
                let dataFromCache = JSON.parse(this.cacheService.personsList).data;
                return of(dataFromCache)
            }
        })
       
        const fetch = createApolloFetch({
            uri: endpoint,
        });

        var promise = fetch({
            query: `query SearchAllPersons {
            persons:getPersons {
              _id
              FirstName
              LastName
              MaidenName,
              Gender,
              YearOfBirth,
              YearOfDeath
            }
          }
          `,
        })

        return from(promise).pipe(map(res => {

            this.cacheService.personsList = this.cacheService.createCacheObject(res, new Date())
            return res
        }))


    }


}