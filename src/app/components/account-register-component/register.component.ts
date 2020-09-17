import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { NotificationService } from 'src/app/_services/NotificationService';
import { Router } from '@angular/router';

export const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const email = control.get('email');
  const password = control.get('password');
  const password2 = control.get('password2');

  if (!email || !password || !password2) {
    return null;
  }


    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailValid =  re.test(String(email.value).toLowerCase());


  let passwordValid = password.value === password2.value;

  return { 
    emailValid: emailValid, 
    passwordValid: passwordValid,
    passwordTooShort: password.value.length < 6
  } ;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private notif: NotificationService,
    private router: Router) {
    this.registerForm = this.fb.group({
      email: '',
      password: '',
      password2: ''
    }, { validators: identityRevealedValidator });

  }

  registerForm: FormGroup = null;

  onSubmit(): void {

    const email = this.registerForm.controls.email.value;
    const password = this.registerForm.controls.password.value;
    if (email && password) {
      this.auth.register(email, password)
        .then((res:any)=>{

          if(res.success){
            this.notif.showSuccess(res.message);
            localStorage.setItem("registered", "true")
            window.location.reload();
          }
          else{
            this.notif.showError(res.message);
          }
          
        })
        
    }
  }

  goToLogin()
  {
      localStorage.setItem("registered", "true");
      this.router.navigateByUrl('/login');
  }

  ngOnInit(): void {
  }

  isConnected() {
    return this.auth.isConnected();
  }

  ngAfterContentInit() {
  }
}
