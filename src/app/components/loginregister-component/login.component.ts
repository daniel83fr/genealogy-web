import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from './node_modules/src/app/_services/AuthenticationService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar) {
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
        .subscribe(
          res => {
            console.log("User is logged in");
            localStorage.setItem("token", res);
            localStorage.setItem("login", login)
            window.location.href = "/";
          },
          err => {
            this._snackBar.open("Login failed", 'close', { duration: 500 })
          }
        );
    }




  }
  ngOnInit(): void {
  }

  ngAfterContentInit() {
  }
}
