import { Component, OnInit, Input, OnChanges, Inject, PLATFORM_ID, APP_ID, SimpleChange, SimpleChanges } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotificationService } from 'src/app/_services/NotificationService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Profile } from 'src/app/_model/Profile';

const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-person-profile-detail',
  templateUrl: './person-profile-detail.component.html',
  styleUrls: ['./person-profile-detail.component.css']
})

export class PersonProfileDetailComponent implements OnInit, OnChanges {

  @Input() id = '';
  @Input() profileData: any = {};
  profileDataNew: any = {};
  endpoint: string;
  changes: any = {};
  personEditForm: FormGroup = null;
  editMode = false;

  @Input() data: any = {};
  @Input() privateData: any = {};
  @Input() editable = false;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string,
    private api: GraphQLService,
    private fb: FormBuilder,
    private notif: NotificationService,
    private auth: AuthenticationService
  ) {
    this.endpoint = this.state.get(STATE_KEY_API, '');
  }
 
  public returnZero() {
    return 0;
  }

  public getPropertyTitle(str: string): string {
    const str2 =  str.split(/(?=[A-Z])/).join(' ');
    return str2.charAt(0).toUpperCase() + str2.slice(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentItem: SimpleChange = changes.profileData;
    if(currentItem.currentValue){
      this.profileData = Object.assign(changes.profileData.currentValue);
      this.profileDataNew = Object.assign({}, changes.profileData.currentValue);
      
    }
  
   
    this.personEditForm = this.fb.group(this.profileDataNew);
  }

  getImage(): string {
    if (this.data?.gender === 'Female') {
      return '../../../assets/img/profile_female.jpg';
    }
    return '../../../assets/img/profile_male.jpg';
  }

  getRole(user): string {
    return 'Admin';
  }

  canEditProfile(): boolean {
    const connectedUser = 'daniel';
    const role = this.getRole(connectedUser);
    if (role === 'Admin') {
      return true;
    }
    return false;
  }

  public syncChanges(): void {
    const toIgnore = ['yearOfDeath', 'yearOfBirth'];
    for (const key in this.profileDataNew) {
      if (!toIgnore.includes(key)) {
        if (this.profileData[key] !== this.personEditForm.get(key).value) {
          this.changes[key] = this.personEditForm.get(key).value;
        } else {
          delete this.changes[key];
        }
      }
    }
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.syncChanges();

    if (Object.keys(this.changes).length === 0 && this.changes.constructor === Object) {

    } else {
        this.updateProfile(this.id, this.changes);
    }
  }

  switchEdit() {
    this.editMode = !this.editMode;
  }

  deleteProfile() {
    const r = confirm(`Delete ${this.data._id}?`);
    if (r === true) {
      // OK

      return this.api.deleteProfile(this.endpoint, this.id)
        .then(res => {
          console.log(res.data);
          this.notif.showSuccess(res.data.removeProfile);
          window.location.href = '/';
        });
    }
  }

  getDisplayName(person: any) {
    let maidenName = person?.maidenName;
    if (!!maidenName) {
      maidenName = ` (${maidenName})`;
    }


    return `${person?.firstName} ${person?.lastName} ${maidenName ?? ''}`;
  }



  onChange(value: MatSlideToggleChange) {
    this.editMode = value.checked;
  }

  canEdit() {
    return this.editMode && this.editable;
  }

  updateProfile(id: string, changes: any) {

    this.api.updateProfile(this.endpoint, id, changes, this.auth.getConnectedProfile())
      .then(res => {
        this.notif.showSuccess('Profile updated.');
        location.reload();
      })
      .catch(err => {
        alert(err);
      }
      );

  }
}

