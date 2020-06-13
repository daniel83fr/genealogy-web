import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';
//import io from 'socket.io-client';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { Router } from '@angular/router';
import { ClientCacheService } from 'src/app/_services/ClientCacheService';
import LoggerService from 'src/app/_services/logger_service';



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

  ioClient: any;
  constructor(
    private configurationService: ConfigurationService,
    private graphQLService: GraphQLService,
    private router: Router,
    private auth: AuthenticationService,
    private cacheService: ClientCacheService) {
      this.date = Date();
  }

  ngOnInit(): void {

  //   this.ioClient = io.connect();
  //   this.ioClient.on('message-received', (msg: any) => {
  //     const message = msg + '\r\n';
  //     this.messages = this.messages + message ;
  // });
  }

  randomPhotos(){
    // const fileCache  = require('../../../cache/randomPhotos.json');
    // this.images = fileCache;
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
          const res =  this.graphQLService.getTodaysEvents(endpoint);
          console.log(JSON.stringify(res));
          return res;
        })
        .then(res =>
          this.events = res);
  }

  search() {
 // let cachedItems = this.cacheService.getPersonListFromCache();
  // this.fillGrid(cachedItems.data);
  let cachedItems:any = { };
    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        return this.graphQLService.getPersonList(endpoint, cachedItems.data.length, cachedItems.timestamp);
      })
      .then(res => {

        console.log(JSON.stringify(res));
        if(!res.isUpToDate){
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
    // if(window.screen.availWidth < 400 ){
    //   this.displayedColumns = ['firstName', 'lastName', 'link'];
    // } else{
    //   this.displayedColumns = ['firstName', 'lastName', 'gender', 'year', 'link'];
    // }
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

  sendMessage(txt: string) {
    if (txt !== '') {
      this.ioClient.emit('message', this.auth.getConnectedLogin() + ': ' + txt.replace('<', ''));
      this.inputMessage = '';
    }

  }
}
