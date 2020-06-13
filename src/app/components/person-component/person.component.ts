import { Component, OnInit, AfterContentInit, OnChanges, Input, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, ParamMap, NavigationEnd, NavigationStart, ActivationEnd, ActivationStart } from '@angular/router';
import * as d3 from 'd3';

import { TreeDraw } from '../../treeDraw';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { Title, Meta } from '@angular/platform-browser';
import { Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import * as path from 'path';


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
    @Inject(PLATFORM_ID) private platformId: Object,
    public rest: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private api: GraphQLService,
    private titleService: Title,
    private metaService: Meta) {
    this.router.events.subscribe((val) => {
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

    let cache = localStorage.getItem('profile_' + id);
    let cacheData
    if (cache != null) {
      cacheData = JSON.parse(cache);
      this.id = cacheData.data.currentPerson._id;
      this.setTitle(cacheData.data.currentPerson);
      this.data = cacheData.data;
      const svg = d3.select('.familyTree');
      new TreeDraw().draw(svg, cacheData.data);

    }
    if (cacheData == undefined || cacheData.timestamp < new Date(new Date().getTime() - 10 * 60000).toJSON()) {
      this.rest.getApiEndpoint()
        .then(endpoint => {
          return this.api.getProfile(endpoint, id);
        })
        .then(data => {
          this.id = data.currentPerson._id;
          this.setTitle(data.currentPerson);
          this.setMeta(data);
          this.data = data;
          const svg = d3.select('.familyTree');
          new TreeDraw().draw(svg, data);
        });
    }


  }
  setTitle(person: any) {
    this.titleService.setTitle(`${person.firstName} ${person.lastName}'s profile`);
  }

  setMeta(data: any) {
    const person = data.currentPerson;
    this.metaService.updateTag({ content: `${person.firstName} ${person.lastName}'s profile` }, 'name="description"');
    this.metaService.updateTag({ content: `${person.firstName}, ${person.lastName}, profile` }, 'name="keywords"');
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

    if (this.profile == undefined) {
      return;
    }
    console.log(this.profile);

    console.log(this.profile);
    this.getProfileById(this.profile);
    if (this.isConnected()) {
      this.getProfilePrivateById(this.profile);
    }
  }

  ngOnInit() {

    if (isPlatformServer(this.platformId)) {

      this.profile = this.route.snapshot.paramMap.get('profile');
      const fs = require('fs');

      const cacheFile = path.join(__dirname, `../cache/profile_${this.profile}.json`);
      if (fs.existsSync(cacheFile)) {
        const rawdata = fs.readFileSync(cacheFile);
        this.data = JSON.parse(rawdata);

        this.id = this.data.currentPerson._id;
        this.setTitle(this.data.currentPerson);
        this.setMeta(this.data);
      }
      else {

        this.titleService.setTitle(`profile ${this.profile}`);
        this.metaService.updateTag({ content: `profile ${this.profile}` }, 'name="description"');
        this.metaService.updateTag({ content: `profile ${this.profile}` }, 'name="keywords"');


      }
    }
  }
}