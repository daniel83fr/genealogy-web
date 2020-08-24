import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    AppModule,
    BrowserModule.withServerTransition({ appId: 'angular-starter' }),
    BrowserTransferStateModule,
    NgbModule
  ],
  bootstrap: [AppComponent],
})
export class AppBrowserModule { }