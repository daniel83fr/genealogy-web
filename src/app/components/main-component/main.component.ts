import { Component, OnInit, ViewChild, AfterContentInit, PLATFORM_ID, APP_ID } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { Router } from '@angular/router';
import { ClientCacheService } from 'src/app/_services/ClientCacheService';
import LoggerService from 'src/app/_services/logger_service';
import { Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import path from 'path';
import { Title, Meta, makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_ENDPOINT = makeStateKey('endpoint');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit, AfterContentInit {

  logger: LoggerService = new LoggerService('main');

  dataSource: any;
  displayedColumns = [];
  date;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  images: any[];
  audit: any[];
  events: any;
  inputMessage = '';
  messages = '';

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private configurationService: ConfigurationService,
    private graphQLService: GraphQLService,
    private router: Router,
    private auth: AuthenticationService,
    private cacheService: ClientCacheService,
    private titleService: Title,
    private metaService: Meta) {
    this.date = Date();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Family Tree - Learn about your Genealogy - Res01.com');
    this.metaService.addTags([
      { name: 'keywords', content: 'ancestry, genetics, lineage, descent, generation, heredity, history, line, parentage blood line, progeniture, clan, folk, group, house, household, people, tribe, ancestors, birth, children, descendants, descent, dynasty, genealogy, generations, in-laws, network, pedigree, progenitors, progeny, relations, relationship, relatives, siblings,' },
      { name: 'description', content: 'Want to know more about your ancestors, and relatives? Come view the family tree, special dates, share photos and keep in touch.' },
      { name: 'robots', content: 'index, follow' },
      { name: 'og:type', content: 'website' },
      { name: 'og:url', content: 'https://www.res01.com/' },
      { name: 'og:title', content: 'Family Tree - Learn about your Genealogy - Res01.com' },
      { name: 'og:description', content: 'Want to know more about your ancestors, and relatives? Come view the family tree,  special dates, share photos and keep in touch.' },
      { name: 'og:image', content: '' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: 'https://www.res01.com/' },
      { name: 'twitter:title', content: 'Family Tree - Learn about your Genealogy - Res01.com' },
      { name: 'twitter:description', content: 'Want to know more about your ancestors, and relatives? Come view the family tree,  special dates, share photos and keep in touch.' },
      { name: 'twitter:image', content: '' }

    ]);

    if (isPlatformServer(this.platformId)) {
      this.state.set(STATE_KEY_ENDPOINT, process.env.GENEALOGY_API);

      const fs = require('fs');
      const cacheFile = path.join(__dirname, `../../../cache/personList.json`);
      if (fs.existsSync(cacheFile)) {
        const rawdata = fs.readFileSync(cacheFile);
        let data = JSON.parse(rawdata).data;
        this.fillGrid(data);
      }

      const photosCacheFile = path.join(__dirname, `../../../cache/randomPhotos.json`);
      if (fs.existsSync(photosCacheFile)) {
        const rawdata = fs.readFileSync(photosCacheFile);
        let data = JSON.parse(rawdata);
        this.images = data;
      }
    }
  }

  randomPhotos() {
    let endpoint: string = this.state.get(STATE_KEY_ENDPOINT, '');
    this.graphQLService.getPhotosRandom(endpoint)
      .then(res =>
        this.images = res);
  }

  ngAfterContentInit() {
    this.search();
    this.randomPhotos();

    let endpoint: string = this.state.get(STATE_KEY_ENDPOINT, '');
    this.graphQLService.getAuditLastEntries(endpoint)
      .then(res =>
        this.audit = res);

    this.graphQLService.getTodaysEvents(endpoint)
      .then(res =>
        this.events = res);
  }

  search() {
    let endpoint: string = this.state.get(STATE_KEY_ENDPOINT, '');
    this.graphQLService.getPersonList(endpoint, 0, new Date(2010, 1, 1).toISOString())
      .then(res => {

        console.log(JSON.stringify(res));
        if (!res.isUpToDate) {
          this.logger.info('cache updated');
          this.fillGrid(res.users);
          this.logger.info('search refreshed');
        }
      });
  }

  private fillGrid(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.displayedColumns = ['firstName', 'lastName', 'link', 'gender'];
  }

  getTitle(element: any) {
    const birth = element.yearOfBirth ?? '';
    const death = element.yearOfDeath ?? '';
    return `${element._id}:
    ${element.firstName} ${element.lastName}
    ${birth}-${death}`;
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
