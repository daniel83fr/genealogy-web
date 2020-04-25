import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(public rest: RestService) { }
  data = {}

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.GetUnusedPersons()
  }

  GetUnusedPersons() {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.getUnusedPersons(endpoint).subscribe((data) => {
        this.data = Object.assign(data)
      });
    })
  }

  removePerson(id: string) {
    this.rest.getApiEndpoint().then((endpoint) => {
      this.rest.removePerson(endpoint, id)
        .subscribe(res => {
          location.reload();
        })
    })
  }

}
