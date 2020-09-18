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
  query='';

  constructor(
    public auth: AuthenticationService,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/' );
  }

  isConnected() {
    return this.auth.isConnected();
  }

  getConnectedLogin() {
    return this.auth.getConnectedLogin();
  }

  getConnectedProfile() {

    this.auth.getNickname(this.getConnectedLogin())
    .then(res=>{
      if(!res || res == undefined || res == ''){
        this.router.navigateByUrl('/update-profile' );
      } else{
        this.router.navigateByUrl('/profile/' + res );
      }
    })
    
  }

  ngAfterContentInit() {
  }
}
