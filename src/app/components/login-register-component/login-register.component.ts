import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotificationService } from 'src/app/_services/NotificationService';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})


export class LoginRegisterComponent implements OnInit {

  @Input('id')
  id = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private notif: NotificationService) {
    this.registerForm = this.fb.group({
      id: '',
      login: '',
      password: '',
      confirm: ''
    });
  }

  edit = false;
  registerForm: FormGroup = null;

  onSubmit(): void {

    const id = this.registerForm.controls.id.value;
    const login = this.registerForm.controls.login.value;
    const password = this.registerForm.controls.password.value;
    const confirm = this.registerForm.controls.confirm.value;

    if (password != confirm) {
      this.notif.showError('Password/confirmation not matching');
      return;
    }

    if (login && password) {
      this.authService.register(id, login, password)
        .then(
          res => {
            this.notif.showSuccess('Registrated');
            window.location.reload();
          }).catch(
          err => {
            this.notif.showError(err);
          }
        );
    }




  }
  ngOnInit(): void {

    this.registerForm = this.fb.group({
      id: this?.id,
      login: '',
      password: '',
      confirm: ''
    });
  }

  ngAfterContentInit() {
  }

  onChange(value: MatSlideToggleChange) {
    this.edit = value.checked;
  }

  click() {
    this.edit = !this.edit;
  }
}
