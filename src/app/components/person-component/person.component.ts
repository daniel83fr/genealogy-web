import { Component, OnInit, AfterContentInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, NavigationEnd, NavigationStart, ActivationEnd, ActivationStart } from '@angular/router';
import * as d3 from 'd3';

import { TreeDraw } from '../../treeDraw';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';

@Component({
  selector: 'app-person-component',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponentComponent implements OnInit, AfterContentInit, OnChanges {
  privateData: any;
  photos: any[];

  refreshing = false;

  constructor(
    public rest: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private api: GraphQLService) {
      const a = this.route.snapshot.paramMap.get('id');
      this.getProfileById(a);
      if (this.isConnected()) {
        this.getProfilePrivateById(a);
      }

      router.events.subscribe((val) => {

        if(this.id != this.route.snapshot.paramMap.get('id')) {
          this.id = this.route.snapshot.paramMap.get('id');
          this.ngOnChanges()
        }
        

      // if (val instanceof NavigationStart || val instanceof NavigationEnd) {
      //   const a = this.route.snapshot.paramMap.get('id');
      //   this.getProfileById(a);
      //   if (this.isConnected()) {
      //     this.getProfilePrivateById(a);
      //   }
        

      // }
    });
  }

  id: any = undefined;
  data: any = {};

  isConnected() {
    return this.auth.isConnected();
  }

  getProfileById(id: string) {
    this.rest.getApiEndpoint()
      .then(endpoint => {
        return this.api.getProfile(endpoint, id);
      })
      .then(res => res.data)
      .then(data => {
        this.id = data.currentPerson._id;
        this.data = data;
        const svg = d3.select('.familyTree');
        new TreeDraw().draw(svg, data);
      });
  }

  getProfilePrivateById(id: string) {
    this.rest.getApiEndpoint()
      .then(endpoint => {
        return this.api.getPrivateInfo(endpoint, id);
      })
      .then(data => {
        this.privateData = data;
      });
  }
  ngAfterContentInit() {

  }

  ngOnChanges() {
    this.getProfileById(this.id);
    if (this.isConnected()) {
      this.getProfilePrivateById(this.id);
    }
  }

  ngOnInit(): void {

  }
}
