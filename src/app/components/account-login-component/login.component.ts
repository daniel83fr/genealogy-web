import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { NotificationService } from 'src/app/_services/NotificationService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private notif: NotificationService,
    private router: Router) {
    this.loginForm = this.fb.group({
      login: '',
      password: ''
    });

    this.changePasswordForm = this.fb.group({
      login: '',
      password: ''
    });
  }

  changePasswordForm: FormGroup = null;
  loginForm: FormGroup = null;

  onSubmit(): void {

    const login = this.loginForm.controls.login.value;
    const password = this.loginForm.controls.password.value;
    if (login && password) {
      this.auth.login(login, password)
        .then(res => {

          this.auth.getNickname(this.auth.getConnectedLogin())
            .then(res2 => {
              if (res2 == undefined || res2 == null) {
                document.location.href = '/update-profile';
              } else {
                document.location.href = `/profile/${res2}`;
              }
            })
            .catch(err => {
              document.location.href = '/update-profile';
            });
          }
        ).catch(
          err => {
            this.notif.showError('Login failed');
          }
        );
    }
  }
  ngOnInit(): void {
  }

  isConnected() {
    return this.auth.isConnected();
  }

  goToRegister() {
    localStorage.removeItem("registered");
    this.router.navigateByUrl('/register');
  }

  ngAfterContentInit() {
  }
}
