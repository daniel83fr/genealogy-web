import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';

@Component({
  selector: 'app-person-link',
  templateUrl: './person-link.component.html',
  styleUrls: ['./person-link.component.css']
})

export class PersonLinkComponent implements OnInit, AfterContentInit {

  @Input() id = '';

  @Input() person: any = {};

  @Input() editable = false;

  @Input() type = '';

  edit = false;
  personEditForm: FormGroup = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public rest: ConfigurationService,
    private graphQLService: GraphQLService
  ) {
    this.personEditForm = this.fb.group({
      id: this.person._id,
      firstName: this.person.firstName,
      lastName: this.person.lastName,
      gender: this.person.gender,
      birthDate: this.person.yearOfBirth,
    });
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
    this.rest.getApiEndpoint()
      .then((endpoint) => {
        return this.graphQLService.removeSiblingLink(endpoint, this.id, this.person._id);
      }).then(res => {
        console.log(res);
        location.reload();
      });
  }

  removeDirectLink() {
    this.rest.getApiEndpoint()
      .then((endpoint) => {
        return this.graphQLService.removeLink(endpoint, this.id, this.person._id);
      }).then(res => {
        console.log(res);
        location.reload();
      });
  }
}
