import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../rest.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { createApolloFetch } from 'apollo-fetch';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  query = ''
  data = []
  dataSource: any;
  displayedColumns = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(public rest: RestService,
    private fb: FormBuilder,
    private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.search()
  }

  search() {

    this.rest.getApiEndpoint().subscribe(endpoint => {
   
      const cachedSearch: any = sessionStorage.getItem("personList");
      if (cachedSearch != null) {
        let json = JSON.parse(cachedSearch);
        this.fillGrid(json);
      }
      else {
        const fetch = createApolloFetch({
          uri: endpoint.replace('api/v1/','') + "graphql",
        });

        fetch({
          query: `query SearchAllPersons {
            persons:getPersons {
              _id
              FirstName
              LastName
            }
          }
          `,
        }).then(res => {
          console.log(res.data);
          sessionStorage.setItem("personList", JSON.stringify(res));
          this.fillGrid(res);
        });
      }
    })
  }

  private fillGrid(json: any) {
    let myData = Object.assign(json.data.persons);
    this.dataSource = new MatTableDataSource(myData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.displayedColumns = ['FirstName', 'LastName', 'Link'];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
