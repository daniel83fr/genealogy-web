import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataAdapter } from '../dataAdapter';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {

  data: any = {};
  changes = []
  id = null

  ngOnInit(): void {
  }

  personEditForm: FormGroup = null;

  constructor(
    public rest: RestService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.personEditForm = this.fb.group({
      'id': '',
      'firstName': '',
      'lastName': '',
      'gender': '',
      'birthDate': '',
      father: this.fb.group({
        'id': '',
        'firstName': '',
        'lastName': '',
      }),
      mother: this.fb.group({
        'id': '',
        'firstName': '',
        'lastName': '',
      }),
      children: this.fb.array([]),
      spouses: this.fb.array([]),
    });
  }

  ngAfterContentInit() {
    this.id = this.route.snapshot.paramMap.get('id')
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.getPersonFull(endpoint, this.id).subscribe((data) => {

        data = new DataAdapter().adapt(data)

        this.data = data;

        this.personEditForm = this.fb.group({
          'id': data.currentPerson._id,
          'firstName': data.currentPerson.FirstName,
          'lastName': data.currentPerson.LastName,
          'gender': data.currentPerson.Gender,
          'birthDate': data.currentPerson.BirthDate,
          father: this.fb.group({
            'id': data.father._id,
            'firstName': data.father.FirstName,
            'lastName': data.father.LastName
          }),
          mother: this.fb.group({
            'id': data.mother._id,
            'firstName': data.mother.FirstName,
            'lastName': data.mother.LastName
          }),
          children: this.fb.array([]),
          spouses: this.fb.array([]),
        });


        let childrenArray = this.personEditForm.get("children") as FormArray
        data.children.forEach(element => {
          childrenArray.push(this.fb.group({
            'id': element._id,
            'firstName': element.FirstName,
            'lastName': element.LastName
          }))
        });

        let spousesArray = this.personEditForm.get("spouses") as FormArray
        data.spouses.forEach(element => {
          spousesArray.push(this.fb.group({
            'id': element._id,
            'firstName': element.FirstName,
            'lastName': element.LastName
          }))
        });




        this.data = data


      });
    })

  }

  get mother(): FormGroup {
    return this.personEditForm.get("mother") as FormGroup
  }

  get father(): FormGroup {
    return this.personEditForm.get("father") as FormGroup
  }

  get children(): FormArray {
    return this.personEditForm.get("children") as FormArray
  }

  get spouses(): FormArray {
    return this.personEditForm.get("spouses") as FormArray
  }


  newSkill(): FormGroup {
    return this.fb.group({
      id: '',
      firstName: '',
      lastName: '',
    })
  }

  addChild() {
    this.children.push(this.newSkill());
  }
  removeFather() {
    this.rest.getApiEndpoint().then((endpoint) => {
    this.rest.removeParentLink(endpoint, this.father.get("id").value, this.id)
    location.reload();
    })
  }

  linkFather() {
    this.rest.getApiEndpoint().then((endpoint) => {
    this.rest.addParentLink(endpoint, this.id, this.father.get("id").value)
    location.reload();
    })
  }

  createFather() {
    this.rest.getApiEndpoint().then((endpoint) => {
    this.rest.createPerson(endpoint, this.father.get("lastName").value, this.father.get("firstName").value, "Male")
      .subscribe(res => {
        this.rest.addParentLink(endpoint, this.id, res)
        location.reload();
      })
    })
  }

  createMother() {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.createPerson(endpoint, this.mother.get("lastName").value, this.mother.get("firstName").value, "Female")
        .subscribe(res => {
          this.rest.addParentLink(endpoint, this.id, res)
          location.reload();
        })
    })



  }

  removeMother() {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.removeParentLink(endpoint, this.mother.get("id").value, this.id)
      location.reload();
    })
  }

  linkMother() {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.addParentLink(endpoint, this.id, this.mother.get("id").value)
      location.reload();
    })


  }
  removeChild(i: number) {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.removeParentLink(endpoint, this.id, this.children.value[i].id)
      location.reload();
    })


  }

  linkChild(i: number) {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.addParentLink(endpoint, this.children.value[i].id, this.id)
      location.reload();
    })
  }

  createChild(i: number) {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.createPerson(endpoint, this.children.value[i].lastName, this.children.value[i].firstName, "")
        .subscribe(res => {
          this.rest.addParentLink(endpoint, res, this.id)
          location.reload();
        })

    })



  }

  addSpouse() {
    this.spouses.push(this.newSkill());
  }

  removeSpouse(i: number) {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.removeSpouseLink(endpoint, this.id, this.spouses.value[i].id)
      this.rest.removeSpouseLink(endpoint, this.spouses.value[i].id, this.id)
      location.reload();
    })
  }

  linkSpouse(i: number) {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.addSpouseLink(endpoint, this.spouses.value[i].id, this.id)
      location.reload();
    })
  }

  createSpouse(i: number) {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.createPerson(endpoint, this.spouses.value[i].lastName, this.spouses.value[i].firstName, "")
        .subscribe(res => {
          this.rest.addSpouseLink(endpoint, res, this.id)
          location.reload();
        })
    })


  }

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
      this.rest.getApiEndpoint().then((endpoint) => {
        this.rest.updatePerson(endpoint, this.id, changes)
        alert("Updated")
      })
    }


  }
}


