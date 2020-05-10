import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})


export class LoginRegisterComponent implements OnInit {

  @Input('id')
  id: string = "";
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar) {
    this.registerForm = this.fb.group({
      'id': '',
      'login': '',
      'password': '',
      'confirm':''
    });
  }

  edit = false
  registerForm: FormGroup = null;

  onSubmit(): void {

    let id = this.registerForm.controls.id.value
    let login = this.registerForm.controls.login.value
    let password = this.registerForm.controls.password.value
    let confirm = this.registerForm.controls.confirm.value

    if(password != confirm){
      this._snackBar.open("Password/confirmation not matching", 'close', { duration: 2000 })
      return
    }

    if (login && password) {
      this.authService.register(id, login, password)
        .then(
          res => {
            alert("registred")
            window.location.reload()
          }).catch(
          err => {
            this._snackBar.open(err, 'close', { duration: 2000 })
          }
        );
    }   




  }
  ngOnInit(): void {

    this.registerForm = this.fb.group({
      'id': this?.id,
      'login': '',
      'password': '',
      'confirm':''
    });
  }

  ngAfterContentInit() {
  }

  onChange(value: MatSlideToggleChange) {
    this.edit = value.checked
  }

  click() {
    this.edit = !this.edit
  }
}
