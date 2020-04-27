import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonComponentComponent } from './person-component/person-component.component';
import { MainComponent } from './main-component/main.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
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
    path: 'person/:id/edit',      component: PersonEditComponent 
  },
  {
    path: 'person/:id',      component: PersonComponentComponent 
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
