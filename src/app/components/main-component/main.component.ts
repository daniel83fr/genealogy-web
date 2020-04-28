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
  
  
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(public rest: RestService,
    private fb: FormBuilder,
    private http: HttpClient) {
  }


  data = []


  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.search()
  }

  dataSource :any;
  displayedColumns=[];
  search() {

    this.rest.getApiEndpoint().subscribe(endpoint => {
     
      this.rest.searchPersons(endpoint).subscribe((data) => {

        let myData = Object.assign(data)
      
        this.dataSource = new MatTableDataSource(myData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayedColumns = [ 'FirstName', 'LastName', 'Link']
       
      });
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




}
