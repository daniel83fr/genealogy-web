import { Component, OnInit, PLATFORM_ID, Inject, APP_ID } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

const STATE_KEY_VERSION = makeStateKey('version');
const STATE_KEY_API = makeStateKey('api');
const STATE_KEY_ENV = makeStateKey('env');

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
    this.endpoint = this.state.get(STATE_KEY_API, '');
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
      this.state.set(STATE_KEY_API, process.env.GENEALOGY_API);
      this.state.set(STATE_KEY_ENV, process.env.NODE_ENV);
    }
  }
}

