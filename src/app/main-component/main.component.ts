import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../rest.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import {CdkTableModule} from '@angular/cdk/table';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent implements OnInit {
  query = ''
  
  personEditForm: FormGroup = null;
  constructor(public rest: RestService,
    private fb: FormBuilder,
    private http: HttpClient) {
    this.personEditForm = this.fb.group({
      'query': this.query,
      items: this.fb.array([]),

    })
  }

  get items(): FormArray {
    return this.personEditForm.get("items") as FormArray
  }


  newSkill(): FormGroup {
    return this.fb.group({
      id: '',
      firstName: '',
      lastName: '',
    })
  }


  data = []


  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.search()
  }

  search() {

    this.rest.getApiEndpoint().subscribe(endpoint => {
      var query = this.personEditForm.get("query").value
      this.rest.searchPersons(endpoint, query).subscribe((data) => {

        let myData = Object.assign(data)
        let childrenArray = this.personEditForm.get("items") as FormArray
        childrenArray.clear()
        myData.forEach(element => {
          childrenArray.push(this.fb.group({
            'id': element._id,
            'firstName': element.FirstName,
            'lastName': element.LastName
          }))
        });
      });
    })
  }




}
