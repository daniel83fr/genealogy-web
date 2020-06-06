import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})


export class FooterComponent implements OnInit {

  environnement: string;
  endpoint: string;
  version: string

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

    this.version = process.env.VERSION;
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

