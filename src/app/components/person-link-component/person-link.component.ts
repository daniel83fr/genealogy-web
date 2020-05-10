import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { createApolloFetch } from 'apollo-fetch';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';



@Component({
  selector: 'app-person-link',
  templateUrl: './person-link.component.html',
  styleUrls: ['./person-link.component.css']
})

export class PersonLinkComponent implements OnInit {
  
  @Input('id')
  id: string = "";

  @Input('person')
  person: any = {};

  @Input('editable')
  editable: boolean = false;

  edit: boolean = false;

  @Input('type')
  type: string = "";

  personEditForm: FormGroup = null;
  
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    public rest: ConfigurationService,
    ){ 
      this.personEditForm = this.fb.group({
        'id': this.person._id,
        'firstName': this.person.firstName,
        'lastName': this.person.lastName,
        'gender': this.person.gender,
        'birthDate': this.person.yearOfBirth,
      })
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
   
  }


  

  removeLink() {
    if(this.type == 'sibling'){
      this.removeSiblingLink()
    }
    else{
      this.removeDirectLink()
    }
    
  }
  removeSiblingLink(){
    this.rest.getApiEndpoint().then((endpoint) => { 
      const fetch = createApolloFetch({
        uri: endpoint.toString(),
      });

      fetch({
        query: `mutation RemoveSiblingLink($id: String!, $id2: String!) {
          removeSiblingLink(_id1: $id, _id2: $id2)
        }
        `,
        variables: {
          "id": this.id,
          "id2": this.person._id
        }
      }).then(res => {
        console.log(res.data);
        alert(res.data.removeSiblingLink)
        location.reload();
      });
    }
    )
  }


  removeDirectLink(){
    this.rest.getApiEndpoint().then((endpoint) => { 
      const fetch = createApolloFetch({
        uri: endpoint.toString(),
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

  linkFather() {
    this.rest.getApiEndpoint().then((endpoint) => { 
      const fetch = createApolloFetch({
        uri: endpoint.toString(),
      });

      fetch({
        query: `mutation addParentLink($id: String!, $id2: String!) {
          addParentLink(_id: $id, _parentId: $id2)
        }        
        `,
        variables: {
          "id": this.id,
          "id2": this.personEditForm.get("id").value
        }
      }).then(res => {
        console.log(res.data);
        alert(res.data.addParentLink)
        location.reload();
      });
    }
    )
  }

  onChange(value: MatSlideToggleChange) {
    this.edit = value.checked
  }
}
