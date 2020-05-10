import { Injectable } from '@angular/core';
import { createApolloFetch } from 'apollo-fetch';

import { ClientCacheService } from './ClientCacheService';
import { EncryptionService} from './EncryptionService';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {

  constructor(private cacheService: ClientCacheService, private encryptionService: EncryptionService) {
  }

  login(endpoint: string, login: string, password: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });
    let encrypted = this.encryptionService.encryptPassword(password);

    return fetch({
      query: `
query Login {
  login(login: "${login}", password: "${encrypted}"){
    success
    token
    error
  }
}`})
      .then(res => res.data.login);
  }

  register(endpoint: string, id: string, login: string, password: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });

    let encrypted = this.encryptionService.encryptPassword(password);
    return fetch({
      query: `
query Register {
  register(id: "${id}", login: "${login}", password: "${encrypted}")
}`}).then(res => {
  return res.data;
});
  }

  shouldResetPersonCache(endpoint: string): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {
      if (this.cacheService.personsList == null) {
        resolve(false);
      }
      const dte = this.cacheService.personsList.timestamp;
      const fetch = createApolloFetch({
        uri: endpoint,
      });
      return fetch({
        query: `query shouldResetCache {
                  shouldResetCache(lastEntry: "${dte}")
                }
            `,
      }).then(res => {
        let shouldReset: boolean;
        shouldReset = res.data.shouldResetCache;
        resolve(shouldReset);
      });

    });


  }

  getPersonList(endpoint: string) {
    this.shouldResetPersonCache(endpoint).then(res => {
      if (res) {
        this.cacheService.clearPersonsList();
      }
      if (this.cacheService.personsList != null) {
        const dataFromCache = this.cacheService.personsList.data;
        return dataFromCache;
      }
    });

    const fetch = createApolloFetch({
      uri: endpoint,
    });
    return fetch({
      query: `query SearchAllPersons {
            persons:getPersons {
              _id
              firstName
              lastName
              maidenName,
              gender,
              yearOfBirth,
              yearOfDeath
            }
          }
          `,
    }).then(res => {

      this.cacheService.personsList = this.cacheService.createCacheObject(res.data.persons, new Date());
      return res.data.persons;
    });

  }

  getProfile(endpoint: string, id: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });
    return fetch({
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
              firstName
              lastName
              maidenName
              gender
              yearOfBirth
              yearOfDeath
            }

            `,
      variables: { 'id': id }
    });
  }

  deleteProfile(endpoint: string, id: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `mutation RemoveProfile($id: String!) {
              removeProfile(_id: $id)
            }
            `,
      variables: {
        'id': id,
      }
    });
  }

  updateProfile(endpoint: string, id: string, changes: any) {

    let objectKeys = Object.keys(changes);

    let patchString = '{';
    objectKeys.forEach(i => {
      patchString += i;
      patchString += ':';
      patchString += '"' + changes[i] + '"';
      patchString += ',';
    }

    );
    patchString += '}';



    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `mutation UpdatePerson($_id:String!) {
              updatePerson(_id: $_id, patch: ${patchString} ) {
                _id
                firstName
                lastName
                maidenName
                gender
              }
            }
            `,
      variables: {
        '_id': id,
      }
    });
  }
}
