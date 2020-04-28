import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../rest.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent implements OnInit {
  query = ''
  
  personEditForm: FormGroup = null;

  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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

  onShare(){
    alert("Not implemented yet.")
  }

  dataSource :any;
  displayedColumns=[];
  search() {

    this.rest.getApiEndpoint().subscribe(endpoint => {
      var query = this.personEditForm.get("query").value
      this.rest.searchPersons(endpoint, query).subscribe((data) => {

        let myData = Object.assign(data)
        let childrenArray = this.personEditForm.get("items") as FormArray
        childrenArray.clear()
        
        this.dataSource = new MatTableDataSource(myData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayedColumns = ['position', 'FirstName', 'LastName', 'Link']
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




}
