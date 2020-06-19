import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BiographyService {


  Generate(data: any) {
    const currentPerson = data.currentPerson;
    const sonDaughter = currentPerson.gender == "Male" ? 'Son' : 'Daughter';
    const heShe = currentPerson.gender == "Male" ? 'He' : 'She';
    const isAlive = !currentPerson.isDead;
    let bio = [];
    let parents = []

    if(data.father?._id != null){
      parents.push( `${data.father.firstName} ${data.father.lastName}`);
    }

    if(data.mother?._id != null){
      parents.push( `${data.mother.firstName} ${data.mother.maidenName}`);
    }

   //bio.push("Grand son/daught of ... (todo)<br>");
    if(parents.length > 0){
      bio.push(`${sonDaughter} of ${parents.join( ' and ')}, `);
    }
    bio.push(`${currentPerson.firstName} was born
    in ${currentPerson.yearOfBirth}.`);

    const siblings = data.siblings;
    bio.push(`${heShe} has ${siblings.length} siblings. `);
    siblings.forEach(element => {
      bio.push(` ${element.firstName} born in ${element.yearOfBirth} ` )
    });
    bio.push(".");

    const spouses = data.spouses;
    spouses.forEach(element => {
      bio.push(`${heShe} married ${element.firstName} ${element.lastName} in ..., ` )
    });
 

    const children = data.children;
    bio.push(`${heShe} has ${children.length} kids. `);
    children.forEach(element => {
      bio.push(` ${element.firstName} born in ${element.yearOfBirth}, ` );
    });


    //bio.push("Grand kids (todo)\n")
    //bio.push("grand grand kids (todo)<br>");
    //bio.push("direct cousins (todo).<br>")

    if(!isAlive){
      bio.push(`${heShe} died in ${currentPerson.yearOfDeath}.`);
    }


    return bio.join('');
  }
}
