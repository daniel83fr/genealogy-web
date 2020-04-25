import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonComponentComponent } from './person-component/person-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main-component/main.component';
import { PersonEditComponent } from './person-edit/person-edit.component';

import { ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin-component/admin.component';
//import {DemoMaterialModule} from './material-module';


@NgModule({
  declarations: [
    AppComponent,
    PersonComponentComponent,
    MainComponent,
    PersonEditComponent,
    AdminComponent,

  ],
  imports: [
    BrowserModule,
    MatCardModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
  //  DemoMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
