import { Injectable } from '@angular/core';
import { createApolloFetch } from 'apollo-fetch';

import { ClientCacheService } from './ClientCacheService';
import { EncryptionService } from './EncryptionService';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {

  constructor(
    private cacheService: ClientCacheService,
    private encryptionService: EncryptionService) {
  }
  login(endpoint: string, login: string, password: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });
    const encrypted = this.encryptionService.encryptPassword(password);

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

    const encrypted = this.encryptionService.encryptPassword(password);
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

  getConnectedUser(endpoint: string) {
    const token = localStorage.getItem('token');
    if (token == null) {
      return null;
    }
    const fetch = createApolloFetch({
      uri: endpoint
    });

    fetch.use(({ request, options }, next) => {

      if (!options.headers) {
        options.headers = {};
      }
      options.headers['authorization'] = `Bearer ${token}`;
      next();
    });

    return fetch({
      query: `query me {
        me{
          id
          login
        }
      }
      `
    })
      .catch(err => {
        throw Error(err);
      })
      .then(res => {
        return res.data.me;
      }
      );
  }
  getPrivateInfo(endpoint: string, id: string) {

    const token = localStorage.getItem('token');
    const fetch = createApolloFetch({
      uri: endpoint
    });

    fetch.use(({ request, options }, next) => {

      if (!options.headers) {
        options.headers = {};
      }
      options.headers['authorization'] = `Bearer ${token}`;
      next();
    });

    return fetch({
      query: `query getPrivateInfoById($_id: String!) {
        getPrivateInfoById( _id : $_id) {
          birthDate
          _id
        }
      }
      `,
      variables: { _id: id }
    })
      .catch(err => {
        throw Error(err);
      })
      .then(res => {
        return res.data.getPrivateInfoById;
      }
      );
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
      variables: { id }
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
        id,
      }
    });
  }

  updateProfile(endpoint: string, id: string, changes: any, privateChange: any) {
    const token = localStorage.getItem('token');
    let patchString = this.generatePatch(changes);
    let privatePatchString = this.generatePatch(privateChange);


    const fetch = createApolloFetch({
      uri: endpoint,
    });

    fetch.use(({ request, options }, next) => {

      if (!options.headers) {
        options.headers = {};
      }
      options.headers['authorization'] = `Bearer ${token}`;
      next();
    });

    return fetch({
      query: `mutation UpdatePerson($_id:String!) {
              updatePerson(_id: $_id, patch: ${patchString} ) {
                _id
                firstName
                lastName
                maidenName
                gender
              },
              updatePersonPrivateInfo(_id: $_id, patch: ${privatePatchString} ) {
                _id
                birthDate
              },
            }
            `,
      variables: {
        _id: id,
      }
    });
  }

  private generatePatch(changes: any) {
    const objectKeys = Object.keys(changes);
    let patchString = '{';
    objectKeys.forEach(i => {
      patchString += i;
      patchString += ':';
      patchString += '"' + changes[i] + '"';
      patchString += ',';
    });
    patchString += '}';
    return patchString;
  }

  createPerson(endpoint: string, changes: any) {
    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    const objectKeys = Object.keys(changes);
    let patchString = '{';
    objectKeys.forEach(i => {
      patchString += i;
      patchString += ':';
      patchString += '"' + changes[i] + '"';
      patchString += ',';
    }

    );
    patchString += '}';


    return fetch({
      query: `mutation createPerson {
          createPerson(person: ${patchString} ) {
            _id
            firstName
            lastName
            maidenName
            gender
            yearOfBirth
          }
        }
        `
    }).then(res => {
      return res.data.createPerson._id;
    });
  }



  removeLink(endpoint: string, person1: string, person2: string) {

    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `mutation RemoveLink($id: String!, $id2: String!) {
          removeLink(_id1: $id, _id2: $id2)
        }
        `,
      variables: {
        id: person1,
        id2: person2
      }
    }).then(res => {
      return res.data.removeLink;
    });
  }

  removeSiblingLink(endpoint: string, person1: string, person2: string) {

    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `mutation RemoveSiblingLink($id: String!, $id2: String!) {
        removeSiblingLink(_id1: $id, _id2: $id2)
      }
      `,
      variables: {
        id: person1,
        id2: person2
      }
    }).then(res => {
      return res.data.removeSiblingLink;
    });
  }
  linkParent(endpoint: string, person1: string, person2: string) {
    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    fetch({
      query: `mutation addParentLink($id: String!, $id2: String!) {
          addParentLink(_id: $id, _parentId: $id2)
        }
        `,
      variables: {
        id: person1,
        id2: person2
      }
    })
      .then(res => {
        return res.data.addParentLink;
      });
  }


  linkChild(endpoint: string, person1: string, person2: string) {

    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `mutation addChildLink($id: String!, $id2: String!) {
          addChildLink(_id: $id, _childId: $id2)
        }
        `,
      variables: {
        id: person1,
        id2: person2
      }
    })
      .then(res => {
        return res.data.addChildLink;
      });
  }


  linkSpouse(endpoint: string, person1: string, person2: string) {

    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    fetch({
      query: `mutation addSpouseLink($id: String!, $id2: String!) {
          addSpouseLink(_id1: $id, _id2: $id2)
        }
        `,
      variables: {
        id: person1,
        id2: person2
      }
    })
      .then(res => {
        console.log(res.data);
        alert(res.data.addSpouseLink);
        location.reload();
      });
  }

  linkSibling(endpoint: string, person1: string, person2: string) {

    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    return fetch({
      query: `mutation addSiblingLink($id: String!, $id2: String!) {
          addSiblingLink(_id1: $id, _id2: $id2)
        }
        `,
      variables: {
        id: person1,
        id2: person2
      }
    })
      .then(res => {
        return res.data.addSiblingLink;
      });
  }

}
