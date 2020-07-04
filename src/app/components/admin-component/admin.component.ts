import { Component, OnInit, EventEmitter, Output, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_ENV = makeStateKey('env');
const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent {
  
  @Output() onSetTitle = new EventEmitter<string>();
  setTitle(){
     this.onSetTitle.emit('Admin Area');
    
  }
  
  environnement: string;
  endpoint: string;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private auth: AuthenticationService) {

    this.environnement = this.state.get(STATE_KEY_ENV, '');
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
}
