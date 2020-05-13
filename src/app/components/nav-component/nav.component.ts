import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit, AfterContentInit {

  environnement = '';
  isConnected = false;
  connectedUser = '';
  profileLink = '/';

  constructor(
    private configurationService: ConfigurationService,
    private graphQLService: GraphQLService) {

    this.configurationService.getEnvironnement()
      .then(env => {
        console.log(env);
        this.environnement = env;
      });

    this.configurationService.getApiEndpoint()
      .then(endpoint => {
        return  this.graphQLService.getConnectedUser(endpoint);
      })
      .then(res => {
        if (res != null) {
          this.profileLink = `/person/${res.id}`;
        }
      })
      ;


  }

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    this.reload()
  }

  reload() {
    window.location.href = this.profileLink;
  }

  ngAfterContentInit() {
    this.isConnected = localStorage.getItem('token') != null;
    this.connectedUser = localStorage.getItem('login');

  }
}
