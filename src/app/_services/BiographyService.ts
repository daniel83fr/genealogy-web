import { Injectable } from '@angular/core';
const numberToText = require('number-to-text')
require('number-to-text/converters/en-us'); 
 


@Injectable({
  providedIn: 'root',
})
export class BiographyService {

  GenerateGrandParents(data: any){
    const res = [];
    const currentPerson = data.currentPerson;
    let grandParents: any[] = data.grandParents ?? [];
    grandParents = grandParents.filter(x => x.firstName != "" || x.lastName != "");
        
    if(grandParents.length > 0) {
      res.push(currentPerson.gender == 'Male' ? 'Grand son ' : 'Grand daughter');
      res.push(' of ');

      grandParents.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName);

        if (index != grandParents.length - 2 && grandParents.length > 2) {
          res.push(', ');
        } else if ( index == grandParents.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    }
    return [];
  }
   
  GenerateParents(data: any) {
    const res = [];
    const currentPerson = data.currentPerson;
    const parents: any = [];
    if (data.father != null && (data.father.firstName != "" && data.father.lastName != "")) {
      parents.push(data.father);
    }
    if (data.mother != null && (data.mother.firstName != "" && data.mother.lastName != "")) {
      parents.push(data.mother);
    }

    if( parents != null && parents.length > 0) {
      res.push(currentPerson.gender == 'Male' ? 'Son ' : 'Daughter');
      res.push(' of ');
      parents.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName);
        if ( index == parents.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }
      });

      return res;
    }
    return [];
  }

  GenerateSiblings(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    const siblings: any[] = data.siblings;
    if( siblings != null && siblings.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(siblings.length, {case:"lowerCase"}) } sibling`);
      if(siblings.length > 1){
        res.push('s');
      }
      res.push('. ');

      siblings.forEach((element, index) => {
        res.push(element.firstName);
        if(element.yearOfBirth != "")
        {
          res.push(' (' + element.yearOfBirth + ')' );
        } 

        if (index != siblings.length - 2 && siblings.length > 2) {
          res.push(', ');
        } else if ( index == siblings.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } else{
      res.push(`${heShe} has no siblings. `);
    }
    return [];
  }

  GenerateSpouses(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    let spouses: any[] = data.spouses ?? [];
    spouses = spouses.filter(x=> x.firstName != "" || x.lastName != "");
    if(spouses.length > 0) {
      res.push(`${heShe} married `);
      spouses.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName );

        if (index != spouses.length - 2 && spouses.length > 2) {
          res.push(', ');
        } else if ( index == spouses.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } 
    return [];
  }

  GenerateChildren(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    const children: any[] = data.children;
    if( children != null && children.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(children.length, {case:"lowerCase"}) } child`);
      if(children.length > 1){
        res.push('ren');
      }
      res.push('. ');

      children.forEach((element, index) => {
        res.push(element.firstName)
        if(element.yearOfBirth != ""){
          res.push(' (' + element.yearOfBirth + ')' );
        } 

        if (index != children.length - 2 && children.length > 2) {
          res.push(', ');
        } else if ( index == children.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } 
    return [];
  }

  GenerateGrandChildren(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    let children: any[] = data.grandChildren ?? [];
    children = children.filter(x => x.firstName != "" || x.lastName != "");
    if( children != null && children.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(children.length, {case:"lowerCase"}) } grand child`);
      if(children.length > 1){
        res.push('ren');
      }
      res.push('. ');

      children.forEach((element, index) => {
        res.push(element.firstName)
        if(element.yearOfBirth != ""){
          res.push( ' (' + element.yearOfBirth + ')' );
        }

        if (index != children.length - 2 && children.length > 2) {
          res.push(', ');
        } else if ( index == children.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } 
    return [];
  }

  GenerateGrandGrandChildren(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    let children: any[] = data.grandGrandChildren ?? [];
    children = children.filter(x => x.firstName != "" || x.lastName != "");

    if( children != null && children.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(children.length, {case:"lowerCase"}) } grand grand child`);
      if(children.length > 1){
        res.push('ren');
      }
      res.push('. ');

      children.forEach((element, index) => {
        res.push(element.firstName);
        if(element.yearOfBirth != ""){
         res.push(' (' + element.yearOfBirth + ')' );
        } 

        if (index != children.length - 2 && children.length > 2) {
          res.push(', ');
        } else if ( index == children.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } 
    return [];
  }


  GenerateCousins(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    let cousins: any[] = data.cousins ?? [];
    cousins = cousins.filter(x => x.firstName != "" || x.lastName != "");
    if( cousins.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(cousins.length, {case:"lowerCase"}) } cousin`);
      if(cousins.length > 1){
        res.push('s');
      }
      res.push('. ');


      cousins.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName);
        if(element.yearOfBirth != ""){
          res.push( ' (' + element.yearOfBirth + ')' );
        }

        if (index != cousins.length - 2 && cousins.length > 2) {
          res.push(', ');
        } else if ( index == cousins.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } 
    return [];
  }

  
  GenerateNiblings(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    let niblings: any[] = data.niblings ?? [];
    
    niblings = niblings.filter(x => x.firstName != "" || x.lastName != "");
    if( niblings != null && niblings.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(niblings.length, {case:"lowerCase"}) } nephews/nices. `);

      niblings.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName)
        if(element.yearOfBirth != ""){
          res.push(' (' + element.yearOfBirth + ')' );
        } 

        if (index != niblings.length - 2 && niblings.length > 2) {
          res.push(', ');
        } else if ( index == niblings.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } 
    return [];
  }

  GenerateBirthInfo(data: any){
    const res = [];
    const currentPerson = data.currentPerson;
    res.push(`${currentPerson.firstName} was born`)
    if(currentPerson.yearOfBirth!= ""){
      res.push(` in ${currentPerson.yearOfBirth}`)
    }
    res.push(". ")
    return res;
  }

  GenerateDeathInfo(data: any){
    const res = [];
    const currentPerson = data.currentPerson;
    const heShe = currentPerson.gender == "Male" ? 'He' : 'She';
    const isAlive = !currentPerson.isDead;

    if(!isAlive){
      res.push(`${heShe} died`);
      if(currentPerson.yearOfDeath!= ""){
        res.push(` in ${currentPerson.yearOfDeath}`)
      }
      res.push(". ")
    }
    return res;
  }

 
  GeneratePiblings(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    let piblings: any[] = data.piblings ?? [];
    piblings = piblings.filter(x => x.firstName != "" || x.lastName != "");
    if( piblings != null && piblings.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(piblings.length, {case:"lowerCase"}) } uncles/aunts. `);

      piblings.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName );

        if (index != piblings.length - 2 && piblings.length > 2) {
          res.push(', ');
        } else if ( index == piblings.length - 2) {
          res.push(' and ');
        } else {
          res.push('. \r\n');
        }

      });
      return res;
    } 
    return [];
  }

  Generate(data: any) {
    const currentPerson = data.currentPerson;
    const heShe = currentPerson.gender == "Male" ? 'He' : 'She';
    const isAlive = !currentPerson.isDead;
    let bio = [];

    bio = bio.concat(this.GenerateGrandParents(data));
    bio = bio.concat(this.GenerateParents(data));
    bio = bio.concat(this.GenerateBirthInfo(data));
    bio = bio.concat(this.GenerateSiblings(data));
    bio = bio.concat(this.GenerateSpouses(data));
    bio = bio.concat(this.GenerateChildren(data));
    bio = bio.concat(this.GenerateCousins(data));
    bio = bio.concat(this.GenerateNiblings(data));
    bio = bio.concat(this.GeneratePiblings(data));
    bio = bio.concat(this.GenerateGrandChildren(data));
    bio = bio.concat(this.GenerateGrandGrandChildren(data));
    bio = bio.concat(this.GenerateDeathInfo(data));

    return bio.join('');
  }
}
