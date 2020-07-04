import { Component, OnInit, Input, AfterContentInit, Inject, PLATFORM_ID, APP_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { Router } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-person-link',
  templateUrl: './person-link.component.html',
  styleUrls: ['./person-link.component.css']
})

export class PersonLinkComponent implements OnInit, AfterContentInit {

  endpoint: string;

  @Input() id = '';

  @Input() person: any = {};

  @Input() editable = false;

  @Input() type = '';

  edit = false;
  personEditForm: FormGroup = null;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private http: HttpClient,
    private fb: FormBuilder,
    private graphQLService: GraphQLService,
    private router: Router
  ) {
    this.personEditForm = this.fb.group({
      id: this.person._id,
      firstName: this.person.firstName,
      lastName: this.person.lastName,
      gender: this.person.gender,
      birthDate: this.person.yearOfBirth,
    });
    this.endpoint = this.state.get(STATE_KEY_API, '');
  }

  onClick() {
    this.router.navigateByUrl('person/' + this.person.profileId);
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {

  }

  removeLink() {
    if (this.type === 'sibling') {
      this.removeSiblingLink();
    } else {
      this.removeDirectLink();
    }
  }

  removeSiblingLink() {
    this.graphQLService.removeSiblingLink(this.endpoint, this.id, this.person._id)
      .then(res => {
        console.log(res);
        location.reload();
      });
  }

  removeDirectLink() {
    this.graphQLService.removeLink(this.endpoint, this.id, this.person._id)
      .then(res => {
        console.log(res);
        location.reload();
      });
  }
}
