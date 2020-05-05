import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TreeDraw } from '../../treeDraw';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { createApolloFetch } from 'apollo-fetch';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';

@Component({
  selector: 'app-person-component',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})


export class PersonComponentComponent implements OnInit {


  constructor(
    public rest: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
    this.personEditForm = this.fb.group({
      'id': '',
      'firstName': '',
      'lastName': '',
      'gender': '',
      'birthDate': ''
    })

    this.fatherEditForm = this.fb.group({
      'id': '',
      'firstName': '',
      'lastName': '',
      'gender': '',
      'birthDate': '',
    })

  }
  id: any = {}
  data: any = {}
  changes = []
  editMode = false;
  editFather = false;
  editMother = false;
  personEditForm: FormGroup = null;
  fatherEditForm: FormGroup = null;
  isConnected = false;

  onSubmit() {
    var changes = {}
    if (this.personEditForm.get('firstName').value != this.data.currentPerson.FirstName) {
      changes['FirstName'] = this.personEditForm.get('firstName').value;
    }
    if (this.personEditForm.get('lastName').value != this.data.currentPerson.LastName) {
      changes['LastName'] = this.personEditForm.get('lastName').value;
    }
    if (this.personEditForm.get('gender').value != this.data.currentPerson.Gender) {
      changes['Gender'] = this.personEditForm.get('gender').value;
    }
    if (this.personEditForm.get('birthDate').value != this.data.currentPerson.BirthDate) {
      changes['BirthDate'] = this.personEditForm.get('birthDate').value;
    }

    if (Object.keys(changes).length === 0 && changes.constructor === Object) {

    }
    else {
      this.rest.getApiEndpoint().subscribe((endpoint) => {
        this.updateProfile(this.id, changes)
        alert("Updated")
      })
    }
  }

  canEdit() {
    return this.editMode && this.isConnected
  }

  onChange(value: MatSlideToggleChange) {
    this.editMode = value.checked
  }

  onChangeFather(value: MatSlideToggleChange) {
    this.editFather = value.checked
  }

  onChangeMother(value: MatSlideToggleChange) {
    this.editMother = value.checked
  }

  ngAfterContentInit() {
    var a = this.route.snapshot.paramMap.get('id')
    this.getProfileById(a)

  }



  ngOnInit(): void {
    this.isConnected = localStorage.getItem("token") != null


  }

  getDisplayName(person: any) {
    let maidenName = person?.MaidenName;
    if (!!maidenName) {
      maidenName = ` (${maidenName})`
    }


    return `${person?.FirstName} ${person?.LastName} ${maidenName ?? ""}`
  }


  getProfileById(id: string) {
   

      this.rest.getApiEndpoint().subscribe(endpoint => {

        const cachedSearch: any = sessionStorage.getItem("profile");
        if (cachedSearch != null) {
          let json = JSON.parse(cachedSearch);

        }
        else {
          const fetch = createApolloFetch({
            uri: endpoint,
          });

          fetch({
            query: `query GetProfile($id: String!) {
              currentPerson: getPersonById(_id: $id) {
                ...PersonInfo
              }
              mother: getMotherById(_id: $id) {
                ...PersonInfo
              }
              father: getFatherById(_id: $id) {
                ...PersonInfo
              },
              children: getChildrenById(_id: $id) {
                ...PersonInfo
              },
              spouses: getSpousesById(_id: $id) {
                ...PersonInfo
              },
              siblings: getSiblingsById(_id: $id) {
                ...PersonInfo
              },
            }
            
            fragment PersonInfo on User {
              _id
              FirstName
              LastName
              MaidenName
              Gender
              YearOfBirth
              YearOfDeath
            }
            
            `,
            variables: { "id": id }
          }).then(res => {
            console.log(res.data);

            this.personEditForm = this.fb.group({
              'id': res.data.currentPerson._id,
              'firstName': res.data.currentPerson.FirstName,
              'lastName': res.data.currentPerson.LastName,
              'gender': res.data.currentPerson.Gender,
              'birthDate': res.data.currentPerson.YearOfBirth
            })

            // if (res.data.father != null) {
            //   this.fatherEditForm = this.fb.group({
            //     'id': res.data.father._id,
            //     'firstName': res.data.father.FirstName,
            //     'lastName': res.data.father.LastName,
            //     'gender': res.data.father.Gender,
            //     'birthDate': res.data.father.YearOfBirth,
            //   })
            // }


            this.id = res.data.currentPerson._id
            this.data = res.data
            var svg = d3.select(".familyTree")
            new TreeDraw().draw(svg, res.data)

          });
        }
      })
   
  }

  deleteProfile() {
    var r = confirm(`Delete ${this.data.currentPerson._id}?`);
    if (r == true) {
      //OK
      this.rest.getApiEndpoint().subscribe((endpoint) => {
        const fetch = createApolloFetch({
          uri: endpoint,
        });

        fetch({
          query: `mutation RemoveProfile($id: String!) {
            removeProfile(_id: $id)
          }
          `,
          variables: {
            "id": this.id,
          }
        }).then(res => {
          console.log(res.data);
          alert(res.data.removeProfile)
          window.location.href = "/"
        });
      }
      )
    }
  }


  updateProfile(id: string, changes: any) {
    this.rest.getApiEndpoint().subscribe((endpoint) => {
      const fetch = createApolloFetch({
        uri: endpoint,
      });

      var objectKeys = Object.keys(changes);
      let patchString = "{"
      objectKeys.forEach(i => {
        patchString += i
        patchString += ":"
        patchString += "\"" + changes[i] + "\""
        patchString += ","
      }

      )
      patchString += "}"

      alert(patchString)


      fetch({
        query: `mutation UpdatePerson($_id:String!) {
          updatePerson(_id: $_id, patch: ${patchString} ) {
            _id
            FirstName
            LastName
            MaidenName
            Gender
            BirthDate
          }
        }        
        `,
        variables: {
          "_id": this.id,
        }
      }).then(res => {
        console.log(res.data);
        alert(res.data.updatePerson)
        location.reload();
      });
    }
    )
  }
  //Father


  linkFather() {
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
          "id2": this.fatherEditForm.get("id").value
        }
      }).then(res => {
        console.log(res.data);
        alert(res.data.addParentLink)
        location.reload();
      });
    }
    )
  }


}
