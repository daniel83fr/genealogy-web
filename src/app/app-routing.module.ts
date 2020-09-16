import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonComponentComponent } from './components/person-component/person.component';
import { MainComponent } from './components/main-component/main.component';
import { AdminComponent } from './components/admin-component/admin.component';
import { HelpComponent } from './components/help-component/help.component';
import { ErrorComponent } from './components/error-component/error.component';
import { AboutComponent } from './components/about-component/about.component';
import { SearchComponent } from './components/search-component/search.component';
import { RegisterComponent } from './components/account-register-component/register.component';
import { AccountUpdateComponent } from './components/account-update-component/accountUpdate.component';
import { LoginComponent } from './components/account-login-component/login.component';
import { AccountUpdateProfileComponent } from './components/account-update-profile-component/accountUpdateProfile.component';

const routes: Routes = [
  {
    path: 'admin',      component: AdminComponent
  },
  {
    path: 'about',      component: AboutComponent
  },
  {
    path: 'help',      component: HelpComponent
  },
  {
    path: 'login',      component: LoginComponent
  },
  {
    path: 'register',      component: RegisterComponent
  },
  {
    path: 'update-account',      component: AccountUpdateComponent
  },
  {
    path: 'update-profile',      component: AccountUpdateProfileComponent
  },
  { path: 'person/:profile',
      redirectTo: 'profile/:profile',
      pathMatch: 'full'
  },
  {
    path: 'profile/:profile',      component: PersonComponentComponent
  },
  {
    path: 'search/:query/:page',      component: SearchComponent
  },
  {
    path: 'search/:query',      component: SearchComponent
  },
  {
    path: '',      component: MainComponent
  },
  {
    path: 'page-not-found',      component: ErrorComponent
  },
  {
    path: '**', redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})

export class AppRoutingModule { }
