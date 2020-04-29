import { Component, OnInit } from '@angular/core';
import { RestService } from '../../rest.service';
import * as d3 from "d3";
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DataAdapter } from '../../dataAdapter';
import { TreeDraw } from '../../treeDraw';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-person-component',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})


export class PersonComponentComponent implements OnInit {


  constructor(
    public rest: RestService,
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

  }
  id:any =  {}
  data: any = {}
  changes = []
  editMode = false;
  editFather = false;
  personEditForm: FormGroup = null;
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
        this.rest.updatePerson(endpoint, this.id, changes)
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
  ngAfterContentInit() {
    var a = this.route.snapshot.paramMap.get('id')
    this.getProducts(a)

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


  getProducts(id: string) {
    this.rest.getApiEndpoint().subscribe(endpoint => {
      this.rest.getPersonFull(endpoint, id).subscribe((data) => {

        data = new DataAdapter().adapt(data)
        this.personEditForm = this.fb.group({
          'id': data.currentPerson._id,
          'firstName': data.currentPerson.FirstName,
          'lastName': data.currentPerson.LastName,
          'gender': data.currentPerson.Gender,
          'birthDate': data.currentPerson.BirthDate})
        this.id = data.currentPerson._id
        this.data = data
        var svg = d3.select(".familyTree")
        new TreeDraw().draw(svg, data)

      })
    }
    );





  }



}
