import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonComponentComponent } from './person-component/person-component.component';
import { MainComponent } from './main-component/main.component';
import { PersonEditComponent } from './person-edit/person-edit.component';
import { AdminComponent } from './admin-component/admin.component';


const routes: Routes = [
  {
    path: 'admin',      component: AdminComponent 
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
