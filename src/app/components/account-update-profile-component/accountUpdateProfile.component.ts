import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { NotificationService } from 'src/app/_services/NotificationService';

@Component({
  selector: 'app-account-update-profile',
  templateUrl: './accountUpdateProfile.component.html',
  styleUrls: ['./accountUpdateProfile.component.css']
})


export class AccountUpdateProfileComponent implements OnInit {
  connectedUser: any;
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private notif: NotificationService) {

      this.changeProfileForm = this.fb.group({
        profileId: 'todo'
      });
  
  
      this.auth.getProfileId(this.auth.getConnectedLogin())
        .then((res: any) => {
  
          this.connectedUser = res;
          this.changeProfileForm.controls.profileId.setValue(res);
        })
        .catch(err => {
          console.log(err);
        });
  }

  changeProfileForm: FormGroup = null;

  onSubmit(): void {

    const profileName = this.changeProfileForm.controls.profileId.value;

    if (profileName.length > 5) {
      this.auth.setProfileId(this.auth.getConnectedLogin(), profileName)
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

  ngAfterContentInit() {
  }
}
