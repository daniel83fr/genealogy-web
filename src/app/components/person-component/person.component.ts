import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import * as d3 from "d3";
import { TreeDraw } from '../../treeDraw';
import { GraphQLService } from 'src/app/_services/GraphQLService';

@Component({
  selector: 'app-person-component',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponentComponent implements OnInit {

  constructor(
    public rest: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private api: GraphQLService) {

  }

  id: any = {}
  data: any = {}
  isConnected = false;


  getProfileById(id: string) {

    this.rest.getApiEndpoint().subscribe(endpoint => {

      this.api.getProfile(endpoint, id)
        .subscribe(res => {
          console.log(res.data);

          this.id = res.data.currentPerson?._id
          this.data = res.data
          var svg = d3.select(".familyTree")
          new TreeDraw().draw(svg, this.data)
        });
    })
  }

  ngAfterContentInit() {
    var a = this.route.snapshot.paramMap.get('id')
    this.getProfileById(a)
  }

  ngOnInit(): void {
    this.isConnected = localStorage.getItem("token") != null
  }
}
