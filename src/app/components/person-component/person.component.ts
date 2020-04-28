import { Component, OnInit } from '@angular/core';
import { RestService } from '../../rest.service';
import * as d3 from "d3";
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DataAdapter } from '../../dataAdapter';
import { TreeDraw } from '../../treeDraw';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-person-component',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})


export class PersonComponentComponent implements OnInit {
 
  
  constructor(
    public rest:RestService, 
    private route: ActivatedRoute,
    private router: Router) {
      
    
  }
  data : any = {}



  ngAfterContentInit() {
    var a = this.route.snapshot.paramMap.get('id')
    this.getProducts(a)
    
  }

  ngOnInit(): void {
   
  }

  getDisplayName(person: any){
    let maidenName = person?.MaidenName;
    if(!!maidenName){
      maidenName = ` (${maidenName})`
    }
   

    return `${person?.FirstName} ${person?.LastName} ${maidenName??""}`
  }
  
  getProducts(id:string) {
      this.rest.getApiEndpoint().subscribe(endpoint=>
      {
        this.rest.getPersonFull(endpoint, id).subscribe((data) => {

          data= new DataAdapter().adapt(data)
          this.data = data
          var svg = d3.select(".familyTree")
          new TreeDraw().draw(svg, data)
          
        })
      }
    );
    

      
  
      
  }


  
}
