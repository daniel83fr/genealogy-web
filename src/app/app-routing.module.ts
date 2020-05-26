import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonComponentComponent } from './components/person-component/person.component';
import { MainComponent } from './components/main-component/main.component';
import { AdminComponent } from './components/admin-component/admin.component';
import { HelpComponent } from './components/help-component/help.component';

import { LoginComponent } from './components/login-component/login.component';

const routes: Routes = [
  {
    path: 'admin',      component: AdminComponent
  },
  {
    path: 'help',      component: HelpComponent
  },
  {
    path: 'login',      component: LoginComponent
  },
  {
    path: 'person/:profile',      component: PersonComponentComponent
  },
  {
    path: '**',      component: MainComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
