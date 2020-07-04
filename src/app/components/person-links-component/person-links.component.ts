import { Component, OnInit, Input, AfterContentInit, APP_ID, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { NotificationService } from 'src/app/_services/NotificationService';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-person-links',
  templateUrl: './person-links.component.html',
  styleUrls: ['./person-links.component.css']
})

export class PersonLinksComponent implements OnInit, AfterContentInit {

  endpoint: string;

  @Input() title = '';

  @Input() id = '';

  @Input() person: any = {};

  @Input() persons: any = [];

  @Input() editable = false;

  edit = false;

  @Input() type = '';

  linkId = '';
  firstName = '';
  lastName = '';

  personEditForm: FormGroup = null;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private http: HttpClient,
    private fb: FormBuilder,
    private graphQLService: GraphQLService,
    private notif: NotificationService,
  ) {
    this.personEditForm = this.fb.group({
      id: this.person._id,
      firstName: this.person.FirstName,
      lastName: this.person.LastName,
      gender: this.person.Gender,
      birthDate: this.person.YearOfBirth,
    });
    this.endpoint = this.state.get(STATE_KEY_API, '');
  }

  ngOnInit(): void {

  }

  ngAfterContentInit() {

  }

  createPersonAndLink() {

    const changes: any = {};
    changes.firstName = this.firstName ?? '';
    changes.lastName = this.lastName ?? '';

    if (changes.firstName == '' && changes.lastName == '') {
      this.notif.showError('please fill up the name.');
      return;
    }

    this.graphQLService.createPerson(this.endpoint, changes)
      .then(res => {
        this.notif.showSuccess('Person created');
        this.linkId = res;
        this.addLink();
      });
  }

  addLink() {
    console.log(`id: ${this.id}`);
    console.log(`LinkId: ${this.linkId}`);
    if (this.linkId == null) {
      this.notif.showError('please fill up the link.');
      return;
    }

    switch (this.type) {
      case 'parent':
        this.linkParent();
        break;
      case 'child':
        this.linkChild();
        break;
      case 'spouse':
        this.linkSpouse();
        break;
      case 'sibling':
        this.linkSibling();
        break;
      default:
        alert(this.type + ' not supported');
    }
  }

  removeLink() {
   this.graphQLService.removeLink(this.endpoint, this.id, this.person._id)
      .then(res => {
        console.log(res.data);
        this.notif.showSuccess('Link removed');
        location.reload();
      });
  }

  linkParent() {
    this.graphQLService.linkParent(this.endpoint, this.id, this.linkId)
      .then(res => {
        this.notif.showSuccess('Link added');
        location.reload();
      });
  }

  linkChild() {
    this.graphQLService.linkChild(this.endpoint, this.id, this.linkId)
      .then(res => {
        this.notif.showSuccess('Link added');
        location.reload();
      });
  }

  linkSpouse() {
   this.graphQLService.linkSpouse(this.endpoint, this.id, this.linkId)
      .then(res => {
        this.notif.showSuccess('Link added');
        location.reload();
      });
  }

  linkSibling() {
    this.graphQLService.linkSibling(this.endpoint, this.id, this.linkId)
      .then(res => {
        this.notif.showSuccess('Link added');
        location.reload();
      });
  }

  switchEdit() {
    this.edit = !this.edit;
  }

  setLink(option: any) {
    this.linkId = option._id;
  }
}
