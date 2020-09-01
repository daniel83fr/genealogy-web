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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, AfterContentInit {

  logger: LoggerService = new LoggerService('search');

  data: any[] = [];
  dataSource: any;
  displayedColumns = [];
  date;
  images: any[];
  audit: any[];
  inputMessage = '';
  messages = '';
  query: any;
  page: string;

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
    this.page = this.route.snapshot.paramMap.get('page') ?? "1";

    if (isPlatformServer(this.platformId)) {
      this.state.set(STATE_KEY_ENDPOINT, process.env.GENEALOGY_API);

      this.graphQLService.searchPerson(process.env.GENEALOGY_API, this.query, parseInt(this.page, 10), 20)
        .then(res => {
            console.log(res.length);
            this.data =  res.data;
        });
    }
    else {
      let endpoint: string = this.state.get(STATE_KEY_ENDPOINT, '');
      this.graphQLService.searchPerson(endpoint, this.query, parseInt(this.page, 10), 20)
      .then(res => {
          console.log(res.length);
          this.data = res.data;
      });
    }
  }

  ngAfterContentInit() {
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

  }
}
