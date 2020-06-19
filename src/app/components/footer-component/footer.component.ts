import { Component, OnInit, PLATFORM_ID, Inject, APP_ID } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

const STATE_KEY_VERSION = makeStateKey('version');

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {

  environnement: string;
  endpoint: string;
  version: string;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private auth: AuthenticationService) {
    
    this.version = this.state.get(STATE_KEY_VERSION, '');
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
    if (isPlatformServer(this.platformId)) {
      this.state.set(STATE_KEY_VERSION, process.env.VERSION);
    }
  }

  ngAfterContentInit() {

  }
}

