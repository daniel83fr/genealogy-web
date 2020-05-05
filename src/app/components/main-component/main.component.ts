import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
   dataSource: any;
   displayedColumns = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private configurationService: ConfigurationService,
    private graphQLService: GraphQLService) {
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.search()
  }

  search() {
    this.configurationService.getApiEndpoint()
      .subscribe(endpoint => {
        this.graphQLService.getPersonList(endpoint)
          .subscribe(res => {
            this.fillGrid(res);
          })
      })
  }

  private fillGrid(json: any) {
    let myData = Object.assign(json.data.persons);
    this.dataSource = new MatTableDataSource(myData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.displayedColumns = ['FirstName', 'LastName', 'Gender', 'Year', 'Link'];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
