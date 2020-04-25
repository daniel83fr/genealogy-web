import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import * as d3 from "d3";
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DataAdapter } from '../dataAdapter';
import { TreeDraw } from '../treeDraw';

@Component({
  selector: 'app-person-component',
  templateUrl: './person-component.component.html',
  styleUrls: ['./person-component.component.css']
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

  
  getProducts(id:string) {
      this.rest.getPersonFull(id).subscribe((data) => {

        data= new DataAdapter().adapt(data)
        this.data = data
        var svg = d3.select(".familyTree")
        new TreeDraw().draw(svg, data)

      });
  }


  
}
