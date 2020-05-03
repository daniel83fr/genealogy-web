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
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NavComponent} from './components/nav-component/nav.component'
import {HelpComponent} from './components/help-component/help.component'
import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AdminComponent } from './components/admin-component/admin.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CdkTableModule} from '@angular/cdk/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import { LoginComponent } from './components/login-component/login.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { FooterComponent } from './components/footer-component/footer.component';
import { BottomSheetOverviewExampleSheet } from './components/share-component/share.component';
import { PersonLinkComponent } from './components/person-link-component/person-link.component';
import { PersonLinksComponent } from './components/person-links-component/person-links.component';
import {MatTooltipModule} from '@angular/material/tooltip';
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
    PersonLinksComponent,
    PersonLinkComponent,

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
    FormsModule,
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
   MatListModule,
   MatSlideToggleModule,
   MatSelectModule,
   MatTooltipModule,
  ],
  entryComponents: [
    BottomSheetOverviewExampleSheet
  ],

  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
