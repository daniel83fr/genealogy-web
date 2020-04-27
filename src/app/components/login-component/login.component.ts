import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  constructor( private fb: FormBuilder, private _snackBar: MatSnackBar) { 
    this.loginForm = this.fb.group({
      'login': '',
      'password': ''});
  }

  loginForm: FormGroup = null;
 
  onSubmit(): void{
    if(this.loginForm.controls.login.value == "daniel" && 
      this.loginForm.controls.password.value == '123'){
        localStorage.setItem("token", "myToken");
        localStorage.setItem("login", "daniel")
        window.location.href = "/";
      }
      else{
        this._snackBar.open("Login failed",'close', { duration : 500})
       
      }

  
  }
  ngOnInit(): void {
  }

  ngAfterContentInit() {
  }
}
