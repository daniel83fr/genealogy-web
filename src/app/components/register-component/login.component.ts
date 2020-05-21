import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../_services/AuthenticationService';
import { NotificationService } from 'src/app/_services/NotificationService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private notif: NotificationService) {
    this.loginForm = this.fb.group({
      'login': '',
      'password': ''
    });
  }

  loginForm: FormGroup = null;

  onSubmit(): void {

    let login = this.loginForm.controls.login.value
    let password = this.loginForm.controls.password.value
    if (login && password) {
      this.authService.login(login, password)
        .then(
          res => {
            console.log("User is logged in");
            localStorage.setItem("token", res.toString());
            localStorage.setItem("login", login)
            window.location.href = "/";
          }).catch(
          err => {
            this.notif.showError("Login failed")
          }
        );
    }




  }
  ngOnInit(): void {
  }

  ngAfterContentInit() {
  }
}
