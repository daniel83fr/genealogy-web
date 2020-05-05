import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RestService } from 'src/app/rest.service';
import { createApolloFetch } from 'apollo-fetch';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import Logger from '../../utils/logger'
import { stringify } from 'querystring';

@Component({
  selector: 'app-person-links',
  templateUrl: './person-links.component.html',
  styleUrls: ['./person-links.component.css']
})

export class PersonLinksComponent implements OnInit {

  @Input('title')
  title: string = "";

  @Input('id')
  id: string = "";

  @Input('person')
  person: any = {};

  @Input('persons')
  persons: any = [];

  @Input('editable')
  editable: boolean = false;

  edit: boolean = false;

  @Input('type')
  type: string = "";

  linkId: string = ""
  firstName: string = ""
  lastName: string = ""

  personEditForm: FormGroup = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public rest: RestService,
  ) {
    this.personEditForm = this.fb.group({
      'id': this.person._id,
      'firstName': this.person.FirstName,
      'lastName': this.person.LastName,
      'gender': this.person.Gender,
      'birthDate': this.person.BirthDate,
    })
  }

  ngOnInit(): void {

  }

  ngAfterContentInit() {

  }

  createPersonAndLink() {
   
    let changes = {}
    changes["FirstName"] = this.firstName;
    changes["LastName"] = this.lastName;
    this.rest.getApiEndpoint().subscribe((endpoint) => { 
      const fetch = createApolloFetch({
        uri: endpoint,
      });

      var objectKeys = Object.keys(changes);
      let patchString = "{"
      objectKeys.forEach(i =>
        {
          patchString+= i
          patchString+= ":"
          patchString+= "\""+ changes[i]+"\""
          patchString+= ","
        }
        
      )
      patchString +="}"

      alert(patchString)
   

      fetch({
        query: `mutation createPerson {
          createPerson(person: ${patchString} ) {
            _id
            FirstName
            LastName
            MaidenName
            Gender
            BirthDate
          }
        }        
        `
      }).then(res => {
        alert(JSON.stringify(res.data))
        this.linkId = res.data.createPerson._id
        this.addLink()
      });
    }
    )


       
  
  }

  addLink() {
    switch (this.type) {
      case "parent":
        this.linkParent()
        break
      case "child":
        this.linkChild()
        break
      case "spouse":
        this.linkSpouse()
        break
      case "sibling":
          this.linkSibling()
          break
      default:
        alert(this.type + " not supported")
    }
  }

  removeLink() {
    this.rest.getApiEndpoint().subscribe((endpoint) => {
      const fetch = createApolloFetch({
        uri: endpoint.replace('api/v1/', '') + "graphql",
      });

      fetch({
        query: `mutation RemoveLink($id: String!, $id2: String!) {
          removeLink(_id1: $id, _id2: $id2)
        }
        `,
        variables: {
          "id": this.id,
          "id2": this.person._id
        }
      }).then(res => {
        console.log(res.data);
        alert(res.data.removeLink)
        location.reload();
      });
    }
    )
  }


  linkParent() {
    this.rest.getApiEndpoint().subscribe((endpoint) => {
      const fetch = createApolloFetch({
        uri: endpoint,
      });

      fetch({
        query: `mutation addParentLink($id: String!, $id2: String!) {
          addParentLink(_id: $id, _parentId: $id2)
        }        
        `,
        variables: {
          "id": this.id,
          "id2": this.linkId
        }
      })
        .then(res => {
          console.log(res.data);
          alert(res.data.addParentLink)
          location.reload();
        });
    }
    )
  }

  linkChild() {
    alert(this.linkId)
    this.rest.getApiEndpoint().subscribe((endpoint) => {
      const fetch = createApolloFetch({
        uri: endpoint.replace('api/v1/', '') + "graphql",
      });

      fetch({
        query: `mutation addChildLink($id: String!, $id2: String!) {
          addChildLink(_id: $id, _childId: $id2)
        }        
        `,
        variables: {
          "id": this.id,
          "id2": this.linkId
        }
      })
        .then(res => {
          console.log(res.data);
          alert(res.data.addChildLink)
          location.reload();
        });
    }
    )
  }

  linkSpouse() {
    alert(this.linkId)
    this.rest.getApiEndpoint().subscribe((endpoint) => {
      const fetch = createApolloFetch({
        uri: endpoint,
      });

      fetch({
        query: `mutation addSpouseLink($id: String!, $id2: String!) {
          addSpouseLink(_id1: $id, _id2: $id2)
        }        
        `,
        variables: {
          "id": this.id,
          "id2": this.linkId
        }
      })
        .then(res => {
          console.log(res.data);
          alert(res.data.addSpouseLink)
          location.reload();
        });
    }
    )
  }

  linkSibling() {
    alert(this.linkId)
    this.rest.getApiEndpoint().subscribe((endpoint) => {
      const fetch = createApolloFetch({
        uri: endpoint,
      });

      fetch({
        query: `mutation addSiblingLink($id: String!, $id2: String!) {
          addSiblingLink(_id1: $id, _id2: $id2)
        }        
        `,
        variables: {
          "id": this.id,
          "id2": this.linkId
        }
      })
        .then(res => {
          console.log(res.data);
          alert(res.data.addSiblingLink)
          location.reload();
        });
    }
    )
  }

  onChange(value: MatSlideToggleChange) {
    this.edit = value.checked
  }


}
