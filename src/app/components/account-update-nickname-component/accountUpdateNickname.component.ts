import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { NotificationService } from 'src/app/_services/NotificationService';

@Component({
  selector: 'app-account-update-nickname',
  templateUrl: './accountUpdateNickname.component.html',
  styleUrls: ['./accountUpdateNickname.component.css'],
})

export class AccountUpdateNicknameComponent implements OnInit {
  connectedUser: any;
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private notif: NotificationService) {
    this.changeProfileForm = this.fb.group({
      profileName: 'todo'
    });


    this.auth.getNickname(this.auth.getConnectedLogin())
      .then((res: any) => {

        this.connectedUser = res;
        this.changeProfileForm.controls.profileName.setValue(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  changeProfileForm: FormGroup = null;

  onSubmit(): void {
    const profileName = this.changeProfileForm.controls.profileName.value;

    if (profileName.length > 5) {
      this.auth.setNickname(this.auth.getConnectedLogin(), profileName)
        .then(res => {
          this.notif.showSuccess('Updated');
        })
        .catch(
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
}
