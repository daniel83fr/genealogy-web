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
            if (res) {
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

    getProfile(endpoint: string, id: string): Observable<any> {
        const fetch = createApolloFetch({
            uri: endpoint,
        });
        var promise = fetch({
            query: `query GetProfile($id: String!) {
              currentPerson: getPersonById(_id: $id) {
                ...PersonInfo
              }
              mother: getMotherById(_id: $id) {
                ...PersonInfo
              }
              father: getFatherById(_id: $id) {
                ...PersonInfo
              },
              children: getChildrenById(_id: $id) {
                ...PersonInfo
              },
              spouses: getSpousesById(_id: $id) {
                ...PersonInfo
              },
              siblings: getSiblingsById(_id: $id) {
                ...PersonInfo
              },
            }
            
            fragment PersonInfo on User {
              _id
              FirstName
              LastName
              MaidenName
              Gender
              YearOfBirth
              YearOfDeath
            }
            
            `,
            variables: { "id": id }
        })
        return from(promise).pipe(map(res => {
            return res
        }))
    }

    deleteProfile(endpoint: string, id: string): Observable<any> {
        const fetch = createApolloFetch({
            uri: endpoint,
        });

        let promise = fetch({
            query: `mutation RemoveProfile($id: String!) {
              removeProfile(_id: $id)
            }
            `,
            variables: {
                "id": id,
            }
        })
        return from(promise).pipe(map(res => {
            return res
        }))
    }

    updateProfile(endpoint: string, id: string, changes: any): Observable<any> {

        var objectKeys = Object.keys(changes);

        let patchString = "{"
        objectKeys.forEach(i => {
            patchString += i
            patchString += ":"
            patchString += "\"" + changes[i] + "\""
            patchString += ","
        }

        )
        patchString += "}"



        const fetch = createApolloFetch({
            uri: endpoint,
        });

        let promise = fetch({
            query: `mutation UpdatePerson($_id:String!) {
              updatePerson(_id: $_id, patch: ${patchString} ) {
                _id
                FirstName
                LastName
                MaidenName
                Gender
                BirthDate
              }
            }        
            `,
            variables: {
                "_id": id,
            }
        })
        return from(promise).pipe(map(res => {
            return res
        }))
    }
}