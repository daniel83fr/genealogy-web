import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @Output() onSetTitle = new EventEmitter<string>();
  setTitle(){
     this.onSetTitle.emit('Admin Area');
  }
  
  constructor(public rest: ConfigurationService) { }
  data = {}

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.GetUnusedPersons()
  }

 
  GetUnusedPersons() {
    // this.rest.getApiEndpoint().subscribe((endpoint) => {
    //   this.rest.getUnusedPersons(endpoint).subscribe((data) => {
    //     this.data = Object.assign(data)
    //   });
    // })
  }

  removePerson(id: string) {
    // this.rest.getApiEndpoint().subscribe((endpoint) => {
    //   this.rest.removePerson(endpoint, id)
    //     .subscribe(res => {
    //       location.reload();
    //     })
    // })
  }

}
