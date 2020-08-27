import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import materialModules from './app.module.material';
import customModules from './app.module.custom';
import { BottomSheetOverviewExampleSheet } from './components/share-component/share.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from './icons/icons.module';


@NgModule({
  declarations: [
    AppComponent,
    ...customModules,
  ],

  imports: [
    ...materialModules,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CdkTableModule,
    IconsModule
  ],

  entryComponents: [
    BottomSheetOverviewExampleSheet
  ],

  providers: [
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
