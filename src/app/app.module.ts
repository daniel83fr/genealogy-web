import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonComponentComponent } from './components/person-component/person.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './components/main-component/main.component';
import { PersonEditComponent } from './person-edit/person-edit.component';

import {NavComponent} from './components/nav-component/nav.component'
import {HelpComponent} from './components/help-component/help.component'
import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule} from '@angular/forms';
import { AdminComponent } from './components/admin-component/admin.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CdkTableModule} from '@angular/cdk/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import { LoginComponent } from './components/login-component/login.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FooterComponent } from './components/footer-component/footer.component';
import { BottomSheetOverviewExampleSheet } from './components/share-component/share.component';
@NgModule({
  declarations: [
    AppComponent,
    PersonComponentComponent,
    MainComponent,
    PersonEditComponent,
    AdminComponent,
    NavComponent,
    HelpComponent,
    LoginComponent,
    FooterComponent,
    

  ],
  imports: [
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    MatCardModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    CdkTableModule,
    MatMenuModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTableModule,
   MatSortModule,
   MatPaginatorModule,
   MatListModule
  ],
  entryComponents: [
    BottomSheetOverviewExampleSheet
  ],

  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
