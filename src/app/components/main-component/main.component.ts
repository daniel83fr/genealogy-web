import { Component, OnInit, ViewChild, AfterContentInit, PLATFORM_ID, APP_ID } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { Router, ActivatedRoute } from '@angular/router';
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

  data: any = [];
  dataSource: any;
  displayedColumns = [];
  date;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  images: any[];
  audit: any[];
  inputMessage = '';
  messages = '';
  query: any;
  page: string;
  registered: boolean;
  loggedIn: boolean;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private graphQLService: GraphQLService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private cacheService: ClientCacheService,
    private titleService: Title,
    private metaService: Meta) {
      this.date = Date();
      this.registered = localStorage.getItem("registered") != null;
      this.loggedIn = this.auth.isConnected();
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

    this.query =  this.route.snapshot.paramMap.get('query');
    this.page = this.route.snapshot.paramMap.get('page');
    if (isPlatformServer(this.platformId)) {
      this.state.set(STATE_KEY_ENDPOINT, process.env.GENEALOGY_API);

      const fs = require('fs');
      const path = require('path')
      const cacheFile = path.join(__dirname, `../../../../cache/personList.json`);
      console.log(cacheFile)

      if (fs.existsSync(cacheFile)) {
        const rawdata = fs.readFileSync(cacheFile);
        let data:any[] = JSON.parse(rawdata);
        this.state.set(STATE_KEY_USERLIST, data);
        this.fillGrid(data);

        let sitemapFile = path.join(__dirname, '../browser/sitemap.xml');
        console.log(`Sitemap: ${path.resolve(sitemapFile)}`);

        var file = [];
        file.push("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">")
        data.forEach(element => {
          file.push(`<url><loc>https://www.res01.com/profile/${element.profileId}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`)
        });
        file.push('</urlset>')
        console.log(`Write sitemap to ${sitemapFile}`);
        const rawdata2 = fs.writeFileSync(sitemapFile, file.join(''));

      }




      this.graphQLService.getPersonList(process.env.GENEALOGY_API)
        .then(res => {
            this.fillGrid(res);
            const rawdata = fs.writeFileSync(cacheFile, JSON.stringify(res.data));
        });


      const photosCacheFile = path.join(__dirname, `../../../../cache/randomPhotos.json`);
      console.log(`Write cache to ${photosCacheFile}`);
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

   
  }

  search() {
    let cacheData: any = this.state.get(STATE_KEY_USERLIST, {});
    this.fillGrid(cacheData)
  }

  private filterValid(row:any, query: string) : boolean{
    var keys = (query.toLocaleLowerCase()??"").split(' ');
    for (const element of keys) {
      if(!(row.firstName?.toLowerCase().includes(element)?? false) &&
      !(row.lastName?.toLowerCase().includes(element)??false) &&
      !(row.maidenName?.toLowerCase().includes(element)??false)){
        return false;
      }
    }
    return true;

  }

  private fillGrid(data: any[]) {
    if(this.query){
      this.data = data.filter(x=>this.filterValid(x, this.query)).sort(() => Math.random() - Math.random()).slice(0, 20);
    }
    else{
      this.data = data.sort(() => Math.random() - Math.random()).slice(0, 20);

    }
   
    // this.dataSource = new MatTableDataSource(data);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.displayedColumns = ['firstName', 'lastName', 'link', 'gender'];
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
    //const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
