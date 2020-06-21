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
    const grandParents: any[] = data.grandParents;
    if( grandParents != null && grandParents.length > 0) {
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
    if (data.father != null) {
      parents.push(data.father);
    }
    if (data.mother != null) {
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
        res.push(element.firstName + ' (' + element.yearOfBirth + ')' );

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
    const spouses: any[] = data.spouses;
    if( spouses != null && spouses.length > 0) {
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
        res.push(element.firstName + ' (' + element.yearOfBirth + ')' );

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
    const children: any[] = data.grandChildren;
    if( children != null && children.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(children.length, {case:"lowerCase"}) } grand child`);
      if(children.length > 1){
        res.push('ren');
      }
      res.push('. ');

      children.forEach((element, index) => {
        res.push(element.firstName + ' (' + element.yearOfBirth + ')' );

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
    const children: any[] = data.grandGrandChildren;
    if( children != null && children.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(children.length, {case:"lowerCase"}) } grand grand child`);
      if(children.length > 1){
        res.push('ren');
      }
      res.push('. ');

      children.forEach((element, index) => {
        res.push(element.firstName + ' (' + element.yearOfBirth + ')' );

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
    const cousins: any[] = data.cousins;
    if( cousins != null && cousins.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(cousins.length, {case:"lowerCase"}) } cousin`);
      if(cousins.length > 1){
        res.push('s');
      }
      res.push('. ');


      cousins.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName + ' (' + element.yearOfBirth + ')' );

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
    const niblings: any[] = data.niblings;
    if( niblings != null && niblings.length > 0) {
      res.push(`${heShe} has ${numberToText.convertToText(niblings.length, {case:"lowerCase"}) } nephews/nices. `);

      niblings.forEach((element, index) => {
        res.push(element.firstName + ' ' + element.lastName + ' (' + element.yearOfBirth + ')' );

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

  GeneratePiblings(data: any){
    const heShe = data.currentPerson.gender == "Male" ? 'He' : 'She';
    const res = [];
    const currentPerson = data.currentPerson;
    const piblings: any[] = data.piblings;
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
    bio = bio.concat([`${currentPerson.firstName} was born in ${currentPerson.yearOfBirth}. `]);
    bio = bio.concat(this.GenerateSiblings(data));
    bio = bio.concat(this.GenerateSpouses(data));
    bio = bio.concat(this.GenerateChildren(data));
    bio = bio.concat(this.GenerateCousins(data));
    bio = bio.concat(this.GenerateNiblings(data));
    bio = bio.concat(this.GeneratePiblings(data));
    bio = bio.concat(this.GenerateGrandChildren(data));
    bio = bio.concat(this.GenerateGrandGrandChildren(data));
  

    if(!isAlive){
      bio.push(`${heShe} died in ${currentPerson.yearOfDeath}.`);
    }

    return bio.join('');
  }
}
