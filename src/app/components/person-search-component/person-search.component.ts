import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter, Inject, PLATFORM_ID, APP_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { GraphQLService } from 'src/app/_services/GraphQLService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ClientCacheService } from 'src/app/_services/ClientCacheService';
import { TransferState, makeStateKey } from '@angular/platform-browser';


export interface User {
  firstName: string;
  lastName: string;
  maidenName: string;
}
const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-person-search',
  templateUrl: './person-search.component.html',
  styleUrls: ['./person-search.component.css']
})

export class PersonSearchComponent implements OnInit, AfterContentInit {

  @Output() personChanged = new EventEmitter<string>();

  myControl = new FormControl();
  options: User[] = [  ];
  filteredOptions: Observable<User[]>;


  endpoint: string;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private http: HttpClient,
    private fb: FormBuilder,
    private graphQLService: GraphQLService,
    private router: Router,
    private cacheService: ClientCacheService
  ) {
    this.endpoint = this.state.get(STATE_KEY_API, '');
  }

  optionSelected(id: any) {
    this.personChanged.emit(id);
  }

  displayFn(user: User): string {
    return user && user.firstName + ' ' + user.lastName;
  }

  getPersonList() {

     this.graphQLService.getPersonList(this.endpoint)
      .then(res => {
          this.options = res.data;
      });
  }

  ngOnInit(): void {

    this.getPersonList();
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.firstName),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase() ;
    return this.options.filter(option =>
      (option.firstName + ' ' + option.lastName).toLowerCase()
      .includes(filterValue));
  }

  ngAfterContentInit() {

  }


}
