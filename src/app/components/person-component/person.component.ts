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

  profile;

  constructor(
    public rest: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private api: GraphQLService) {

    router.events.subscribe((val) => {
      if (this.profile != this.route.snapshot.paramMap.get('profile')) {
        this.profile = this.route.snapshot.paramMap.get('profile');
        this.ngOnChanges();
      }
    });

    this.ngOnChanges();
  }

  id: any = undefined;
  data: any = {};

  isConnected() {
    return this.auth.isConnected();
  }

  getProfileId(profileId: string) {
    return this.rest.getApiEndpoint()
      .then(endpoint => {
        return this.api.getProfileId(endpoint, profileId);
      });
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

    if(this.profile == undefined){
      return;
    }
    console.log(this.profile);
    this.getProfileId(this.profile)
      .then(profileId => {
        console.log(profileId);
        this.getProfileById(profileId);
        if (this.isConnected()) {
          this.getProfilePrivateById(profileId);
        }
      });
  }

  ngOnInit(): void {

  }
}
