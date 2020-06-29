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

import { Title, Meta, makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_ENDPOINT = makeStateKey('endpoint');
const STATE_KEY_USERLIST = makeStateKey('userlist')
const STATE_KEY_PHOTOS = makeStateKey('photos')

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
      const path = require('path')
      const cacheFile = path.join(__dirname, `../../../cache/personList.json`);
      console.log(cacheFile)

      let now = new Date(2010, 1, 1).toISOString();
      let count = 0;
      if (fs.existsSync(cacheFile)) {
        const rawdata = fs.readFileSync(cacheFile);
        let data = JSON.parse(rawdata);
        count = data.data.length;
        now = data.timestamp;
        this.state.set(STATE_KEY_USERLIST, data.data);
        this.fillGrid(data.data);

        let sitemapFile = '../frontEnd/browser/sitemap.xml';

        var file = [];
        file.push("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">")
        data.data.forEach(element => {
          file.push(`<url><loc>https://www.res01.com/person/${element.profileId}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`)
        });
        file.push('</urlset>')
        const rawdata2 = fs.writeFileSync(sitemapFile, file.join(''));

      }




      this.graphQLService.getPersonList(process.env.GENEALOGY_API, count, now)
        .then(res => {

          if (!res.isUpToDate) {
            console.log(`Write cache to ${cacheFile}`)
            let cacheObj = new ClientCacheService().createCacheObject(res.users);
            const rawdata = fs.writeFileSync(cacheFile, JSON.stringify(cacheObj));
            this.state.set(STATE_KEY_USERLIST, res.users);
            this.fillGrid(res.users);
          }
        });


      const photosCacheFile = path.join(__dirname, `../../../cache/randomPhotos.json`);
      console.log(`Write cache to ${photosCacheFile}`)
      if (fs.existsSync(photosCacheFile)) {
        const rawdata = fs.readFileSync(photosCacheFile);
        let data = JSON.parse(rawdata);
        this.state.set(STATE_KEY_PHOTOS, data.data);
        this.images = data;
      }

      this.graphQLService.getPhotosRandom(process.env.GENEALOGY_API)
        .then(res => {
          let cacheObj = new ClientCacheService().createCacheObject(res);
          const rawdata = fs.writeFileSync(photosCacheFile, JSON.stringify(cacheObj));

        }
        );

    }
  }

  randomPhotos() {
    this.images = this.state.get(STATE_KEY_PHOTOS, []);
  }

  ngAfterContentInit() {
    this.search();
    this.randomPhotos();

    let endpoint: string = this.state.get(STATE_KEY_ENDPOINT, '');
    this.graphQLService.getPhotosRandom(endpoint)
      .then(res =>
        this.images = res);

    this.graphQLService.getAuditLastEntries(endpoint)
      .then(res =>
        this.audit = res);

    this.graphQLService.getTodaysEvents(endpoint)
      .then(res =>
        this.events = res);
  }

  search() {
    let cacheData: any = this.state.get(STATE_KEY_USERLIST, {});
    this.fillGrid(cacheData)
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
