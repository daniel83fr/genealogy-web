import { Component, OnInit, ViewChild, AfterContentInit, PLATFORM_ID } from '@angular/core';
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
import { Title, Meta } from '@angular/platform-browser';




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
    @Inject(PLATFORM_ID) private platformId: Object,
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
    this.titleService.setTitle("Res01.com - Family Tree");
    this.metaService.addTags([
      { name: 'keywords', content: 'ancestry, genetics, lineage, descent, generation, heredity, history, line, parentage blood line, progeniture, clan, folk, group, house, household, people, tribe, ancestors, birth, children, descendants, descent, dynasty, genealogy, generations, in-laws, network, pedigree, progenitors, progeny, relations, relationship, relatives, siblings,' },
      { name: 'description', content:  'Welcome to Family Tree - A simple website to view/edit family tree and share some photos.' },
      { name: 'robots', content: 'index, follow' }
    ]);

    if (isPlatformServer(this.platformId)) {

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
    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        return this.graphQLService.getPhotosRandom(endpoint);
      })
      .then(res =>
        this.images = res);
  }

  ngAfterContentInit() {
    this.search();
    this.randomPhotos();

    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        return this.graphQLService.getAuditLastEntries(endpoint);
      })
      .then(res =>
        this.audit = res);

    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        const res = this.graphQLService.getTodaysEvents(endpoint);
        console.log(JSON.stringify(res));
        return res;
      })
      .then(res =>
        this.events = res);
  }

  search() {

    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        return this.graphQLService.getPersonList(endpoint, 0, new Date(2010,1,1).toISOString());
      })
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
