import { Component, OnInit, AfterContentInit, OnChanges, PLATFORM_ID, APP_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';

import { TreeDraw } from '../../treeDraw';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { Title, Meta, TransferState, makeStateKey } from '@angular/platform-browser';
import { Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import * as path from 'path';

const STATE_KEY_ITEMS = makeStateKey('items');
const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-person-component',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponentComponent implements OnInit, AfterContentInit, OnChanges {

  endpoint: string;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private api: GraphQLService,
    private titleService: Title,
    private metaService: Meta) {

    this.endpoint = this.state.get(STATE_KEY_API, '');

    this.router.events.subscribe((val) => {
      if (this.profile != this.route.snapshot.paramMap.get('profile')) {
        this.profile = this.route.snapshot.paramMap.get('profile');
        this.ngOnChanges();
      }
    });

    this.ngOnChanges();
  }

  privateData: any;
  photos: any[];
  refreshing = false;
  profile;
  id: any = undefined;
  data: any = {};

  isConnected() {
    return this.auth.isConnected();
  }

  getProfileById(id: string) {
    let cacheData: any = this.state.get(STATE_KEY_ITEMS, {});

    if (cacheData?.currentPerson != null) {
      this.id = cacheData?.currentPerson?._id;
      this.setTitle(cacheData?.currentPerson);
      this.data = cacheData;
      const svg = d3.select('.familyTree');
      new TreeDraw().draw(svg, cacheData);
    }
    
      this.api.getProfile(this.endpoint, id)
      .then(data => {
        this.id = data.currentPerson._id;
        this.setTitle(data.currentPerson);
        this.setMeta(data);
        this.data = data;
        const svg = d3.select('.familyTree');
      new TreeDraw().draw(svg, data);
  
      });
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
    this.api.getPrivateInfo(this.endpoint, id)
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

      this.state.set(STATE_KEY_API, process.env.GENEALOGY_API);
      
      const cacheFile = path.join(__dirname, `../../../../cache/profile_${this.profile}.json`);
      console.log(`Cache file: ${cacheFile}`)
      if (fs.existsSync(cacheFile)) {
        const rawdata = fs.readFileSync(cacheFile);
        this.data = JSON.parse(rawdata);
        this.state.set(STATE_KEY_ITEMS, this.data);
        this.id = this.data.currentPerson._id;

        this.setMeta(this.data);
        const person = this.data.currentPerson;
        this.titleService.setTitle(`${person.firstName} ${person.lastName}'s profile`);
        this.metaService.addTags([
          { name: 'keywords', content: `${person.firstName} ${person.lastName},${person.firstName},${person.lastName},profile` },
          { name: 'description', content: `${person.firstName} ${person.lastName}'s profile` },
          { name: 'robots', content: 'index, follow' }
        ]);
      }
      else {

        this.titleService.setTitle(`profile ${this.profile}`);
        this.metaService.addTags([
          { name: 'keywords', content: `profile ${this.profile}` },
          { name: 'description', content: `profile ${this.profile}` },
          { name: 'robots', content: 'index, follow' }
        ]);

        this.api.getProfile(process.env.GENEALOGY_API, this.profile);
      }
    }
  }
}