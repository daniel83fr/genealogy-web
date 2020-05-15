import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';

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
  
  environnement: string;
  endpoint: string;

  constructor(
    private configurationService: ConfigurationService,
    private auth: AuthenticationService) {

    this.configurationService.getEnvironnement()
      .then(env => {
        this.environnement = env;
      });

    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        this.endpoint = endpoint;
      });
  }

  isConnected() {
    return this.auth.isConnected();
  }

  connectedLogin() {
    return this.auth.getConnectedLogin();
  }

  connectedProfile() {
    return this.auth.getConnectedProfile();
  }


  ngOnInit(): void {
  }

  ngAfterContentInit() {
   
  }
}
