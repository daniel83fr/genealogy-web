import { Injectable } from '@angular/core';
import { createApolloFetch } from 'apollo-fetch';

import { ClientCacheService } from './ClientCacheService';
import { EncryptionService } from './EncryptionService';

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {

  addPhoto(endpoint: string, link: any, deletehash: any, persons: any[]) {
    const token = localStorage.getItem('token');

    const fetch = createApolloFetch({
      uri: endpoint,
    });

    fetch.use(addToken(token));

    return fetch({
      query: `mutation addPhoto($link: String!, $deleteHash: String, $persons: [String] ) {
  addPhoto( url : $link, deleteHash :$deleteHash, persons:$persons)
          }
          `,
      variables: { link, deleteHash: deletehash, persons }
    }).then(res => {
      return res.data.addPhoto;
    });
  }

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

  register(endpoint: string, id: string, login: string, email: string, password: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });

    const encrypted = this.encryptionService.encryptPassword(password);
    return fetch({
      query: `
query Register {
  register(id: "${id}", login: "${login}", email: "${email}" password: "${encrypted}")
}`}).then(res => {
        return res.data;
      });
  }


  getPersonList(endpoint: string, itemCount: number, cacheDate: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });
    return fetch({
      query: `query SearchAllPersons($cacheCount: Int, $cacheDate: String) {
            data: getPersonList(cacheCount: $cacheCount, cacheDate: $cacheDate) {
              users{
                _id
                firstName
                lastName
                maidenName,
                gender,
                yearOfBirth,
                yearOfDeath,
                isDead,
                profileId
              },
              isUpToDate
            }
          }
          `,
      variables: { cacheCount: itemCount, cacheDate: cacheDate }
    }).then(res => {

      if (!res.data.data.isUpToDate) {
        this.cacheService.personsList = this.cacheService.createCacheObject(res.data.data.users);
      }
      return res.data.data;
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
      query: `query getPrivateInfo($_id: String!) {
        getPrivateInfo( _id : $_id) {
          birthDate
          deathDate
          currentLocation
          birthLocation
          deathLocation
          email
          phone
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
        return res.data.getPrivateInfo;
      }
      );
  }

  getProfile(endpoint: string, id: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });
    return fetch({
      query: `query GetProfile($id: String!) {
        getPublicInfo( _id : $id) {
          currentPerson{
            ...PersonInfo
          }
          mother{
            ...PersonInfo
          }
          father{
            ...PersonInfo
          }
          siblings{
            ...PersonInfo
          }
          spouses{
            ...PersonInfo
          }
          children{
            ...PersonInfo
          }
          photos{
            url
            _id
            persons{
              ...PhotoTag
            }
          }
      }
    }
    
    fragment PhotoTag on User {
                  _id
                  firstName
                  lastName
                  profileId
                }
       fragment PersonInfo on User {
                  _id
                  firstName
                  lastName
                  maidenName
                  gender
                  yearOfBirth
                  yearOfDeath
                  isDead,
                  profileId
                }
            `,
      variables: { id }
    })
    .then(res=>{
      let cacheObject = this.cacheService.createCacheObject(res.data.getPublicInfo);
      localStorage.setItem("profile_"+ id, JSON.stringify( cacheObject))
      return res.data.getPublicInfo;

    });
  }

  getProfileId(endpoint: string, id: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });
    return fetch({
      query: `query GetProfileId($id: String!) {
              getProfileId(_id: $id)
            }
            `,
      variables: { id }
    })
      .then(res => {
        console.log(JSON.stringify(res));
        return res?.data?.getProfileId ?? id;
      })
      .catch(err => {
        return id;
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
    const patchString = this.generatePatch(changes);
    const privatePatchString = this.generatePatch(privateChange);


    const fetch = createApolloFetch({
      uri: endpoint,
    });

    fetch.use(addToken(token));

    return fetch({
      query: `mutation UpdatePerson($_id:String!) {
              updatePerson(_id: $_id, patch: ${patchString} ) {
                _id
                firstName
                lastName
                maidenName
                gender
                isDead
              },
              updatePersonPrivateInfo(_id: $_id, patch: ${privatePatchString} ) {
                _id
                birthDate
                deathDate
                currentLocation
                birthLocation
                deathLocation
                email
                phone
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

  getPhotos(endpoint: string, person: string) {

    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `query getPhotosById($_id: String!) {
        getPhotosById(_id: $_id) {
          _id
          url
          persons{
            firstName
            lastName
            _id
          }
        }
      }
          `,
      variables: { _id: person }
    })
      .catch(err => {
        throw Error(err);
      }).then(res => {
        return res.data?.getPhotosById;
      });

  }

  getProfilePhoto(endpoint: string, person: string) {

    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `query getPhotoProfile($_id: String!) {
  getPhotoProfile( _id : $_id) {
              url
              _id
            }
          }
          `,
      variables: { _id: person }
    })
      .catch(err => {
        throw Error(err);
      }).then(res => {
        return res.data?.getPhotoProfile;
      });

  }
  getPhotosRandom(endpoint: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `query GetPhotos {
        photos: getPhotosRandom(number: 5) {
          url
          _id
        }
      }`
    }).then(res => {
      return res.data.photos;
    });

  }
  getTodaysEvents(endpoint: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `query getTodayMarriagedays {
        birthday: getTodayBirthdays{
         ...usr
        },
        deathday: getTodayDeathdays{
         ...usr
        },
        marriage: getTodayMarriagedays{
         ...usr
        }
      }
      fragment usr on User{
           _id
          firstName
          lastName
      }
      `
    }).then(res => {
      return res.data;
    });

  }
  getAuditLastEntries(endpoint: string) {
    const fetch = createApolloFetch({
      uri: endpoint,
    });

    return fetch({
      query: `query GetAudit {
        audit: getAuditLastEntries(number: 10) {
          timestamp
          type
          id
          user
          action
        }
      }
      `
    }).then(res => {
      return res.data.audit;
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

    return fetch({
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

  deletePhoto(endpoint: string, image: string) {
    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    return fetch({
      query: `mutation deletePhoto($image: String!) {
        deletePhoto(image: $image)
        }
        `,
      variables: {
        image: image
      }
    })
      .then(res => {
        return res.data.deletePhoto;
      });
  }

  setProfilePicture(endpoint: string, person: string, image: string) {
    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    return fetch({
      query: `mutation setProfilePicture($person: String!, $image: String!) {
        setProfilePicture(person: $person, image: $image)
        }
        `,
      variables: {
        person: person,
        image: image
      }
    })
      .then(res => {
        return res.data.setProfilePicture;
      });
  }

  addPhotoTag(endpoint: string, person: string, image: string) {
    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    return fetch({
      query: `mutation addPhotoTag($person: String!, $image: String!) {
        addPhotoTag(image: $image, tag: $person)
        }
        `,
      variables: {
        person: person,
        image: image
      }
    })
      .then(res => {
        return res.data.addPhotoTag;
      });
  }

  removePhotoTag(endpoint: string, person: string, image: string) {
    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    return fetch({
      query: `mutation removePhotoTag($person: String!, $image: String!) {
        removePhotoTag(image: $image, tag: $person)
        }
        `,
      variables: {
        person: person,
        image: image
      }
    })
      .then(res => {
        return res.data.removePhotoTag;
      });
  }

  linkSpouse(endpoint: string, person1: string, person2: string) {

    const fetch = createApolloFetch({
      uri: endpoint.toString(),
    });

    return fetch({
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
        return res.data.addSpouseLink;
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

function addToken(token: string) {
  return ({ request, options }, next) => {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers.authorization = `Bearer ${token}`;
    next();
  };
}



