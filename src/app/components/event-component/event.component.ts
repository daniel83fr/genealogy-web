import { Component, OnInit, ViewChild, AfterContentInit, PLATFORM_ID, APP_ID } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import LoggerService from 'src/app/_services/logger_service';
import { Inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_ENDPOINT = makeStateKey('endpoint');


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})

export class EventComponent implements OnInit, AfterContentInit {

  logger: LoggerService = new LoggerService('event');

  dataSource: any;
  displayedColumns = [];
  date;

  events: any;
  inputMessage = '';
  messages = '';

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string,
    private graphQLService: GraphQLService) {
    this.date = Date();
  }

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.state.set(STATE_KEY_ENDPOINT, process.env.GENEALOGY_API);
    }
  }

  ngAfterContentInit() {
    let endpoint: string = this.state.get(STATE_KEY_ENDPOINT, '');
    this.graphQLService.getTodaysEvents(endpoint)
      .then(res =>
        this.events = res);

        
  }
}
