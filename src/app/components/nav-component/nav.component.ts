import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  env = ""
  constructor(
    private configurationService: ConfigurationService) {

    this.configurationService.getEnvironnement()
      .then(env => {
        this.env = env
      });
  }

  isConnected = false;
  connectedUser = "";

  ngOnInit(): void {
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("login")
    window.location.reload();
  }

  ngAfterContentInit() {
    this.isConnected = localStorage.getItem("token") != null
    this.connectedUser = localStorage.getItem("login")

  }
}
