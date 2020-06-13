import {GraphQLService} from './src/app/_services/GraphQLService';
import { ClientCacheService } from './src/app/_services/ClientCacheService';
import { EncryptionService } from './src/app/_services/EncryptionService';
var fs = require('fs');

class admin_tasks{
  GenerateCache(res: any){
    const graphQLService = new GraphQLService(new ClientCacheService(), new EncryptionService());
    graphQLService.getPersonList(process.env.GENEALOGY_API, 0, '2010-06-10T17:58:41.016Z')
    .then((persons:any) => {
      
      persons.users.forEach(person => {
        graphQLService.getProfile(process.env.GENEALOGY_API, person.profileId)
        .then(profile =>{
          let aaa = { "data": profile, "timestamp": new Date().toISOString() }
          
          fs.writeFile(`cache/profile_${person.profileId}.json`, JSON.stringify(aaa), function(err) {
              if (err) {
                  console.log(err);
              }
          })
          ;
        })
        ;
        
      })
      .then(res.send({
        'Status': 'DOne'
      }));
     
    }
    );
  }
}

export default new admin_tasks();
