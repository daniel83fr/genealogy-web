import { Component, OnInit, AfterContentInit } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit, AfterContentInit {

  environnement = '';

  connectedUser = '';
  profileLink = '/';

  constructor(
    private graphQLService: GraphQLService,
    public auth: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout();
  }

  isConnected() {
    return this.auth.isConnected();
  }

  getConnectedLogin() {
    return this.auth.getConnectedLogin();
  }

  getConnectedProfile() {

    this.router.navigateByUrl('/person/' + this.getConnectedLogin());
  }

  ngAfterContentInit() {
  }
}
