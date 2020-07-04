import { Component, OnInit, Input, OnChanges, Inject, PLATFORM_ID, APP_ID } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotificationService } from 'src/app/_services/NotificationService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-person-profile-detail',
  templateUrl: './person-profile-detail.component.html',
  styleUrls: ['./person-profile-detail.component.css']
})

export class PersonProfileDetailComponent implements OnInit, OnChanges {

  @Input() id = '';

  @Input() data: any = {};
  @Input() privateData: any = {};
  @Input() editable = false;
  endpoint: string;

  personEditForm: FormGroup = null;
  editMode = false;
  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private api: GraphQLService,
    private fb: FormBuilder,
    private notif: NotificationService,
    private auth: AuthenticationService
  ) {
    this.personEditForm = this.fb.group({
      id: '',
      firstName: '',
      lastName: '',
      gender: '',
      yearOfBirth: '',
      birthDate: '',
      yearOfDeath: '',
      deathDate: '',
      isDead: '',
      currentLocationCountry: '',
      birthLocationCountry: '',
      deathLocationCountry: '',
      currentLocationCity: '',
      birthLocationCity: '',
      deathLocationCity: '',
      email: '',
      phone: '',
    });
    this.endpoint = this.state.get(STATE_KEY_API, '');


  }
  ngOnChanges(changes: any): void {
    this.personEditForm = this.fb.group({
      id: this.data?._id,
      firstName: this.data?.firstName,
      lastName: this.data?.lastName,
      gender: this.data?.gender,
      yearOfBirth: this.data?.yearOfBirth,
      birthDate: this.privateData?.birthDate,
      yearOfDeath: this.data?.yearOfDeath,
      deathDate: this.privateData?.deathDate,
      isDead: this.data?.isDead ?? false,
      currentLocationCountry: this.privateData?.currentLocationCountry,
      birthLocationCountry: this.privateData?.birthLocationCountry,
      deathLocationCountry: this.privateData?.deathLocationCountry,
      currentLocationCity: this.privateData?.currentLocationCity,
      birthLocationCity: this.privateData?.birthLocationCity,
      deathLocationCity: this.privateData?.deathLocationCity,
      email: this.privateData?.email,
      phone: this.privateData?.phone,
    });
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

  ngOnInit(): void {

  }

  onSubmit() {
    const changes: any = {};
    if (this.personEditForm.get('firstName').value !== this.data.firstName && this.personEditForm.get('firstName').value) {
      changes.firstName = this.personEditForm.get('firstName').value;
    }
    if (this.personEditForm.get('lastName').value !== this.data.lastName && this.personEditForm.get('lastName').value) {
      changes.lastName = this.personEditForm.get('lastName').value;
    }
    if (this.personEditForm.get('gender').value !== this.data.gender && this.personEditForm.get('gender').value) {
      changes.gender = this.personEditForm.get('gender').value;
    }
    if (this.personEditForm.get('isDead').value !== this.data.isDead && this.personEditForm.get('isDead').value) {
      changes.isDead = this.personEditForm.get('isDead').value;
    }

    const privateChanges: any = {};

    if (this.personEditForm.get('birthDate').value !== this.data.privateData?.birthDate && this.personEditForm.get('birthDate').value) {
      privateChanges.birthDate = this.personEditForm.get('birthDate').value;
    }

    if (this.personEditForm.get('deathDate').value !== this.data.privateData?.deathDate && this.personEditForm.get('deathDate').value) {
      privateChanges.deathDate = this.personEditForm.get('deathDate').value;
    }

    if (this.personEditForm.get('currentLocationCountry').value !== this.data.privateData?.currentLocationCountry && this.personEditForm.get('currentLocationCountry').value) {
      privateChanges.currentLocationCountry = this.personEditForm.get('currentLocationCountry').value;
    }

    if (this.personEditForm.get('currentLocationCity').value !== this.data.privateData?.currentLocationCity && this.personEditForm.get('currentLocationCity').value) {
      privateChanges.currentLocationCity = this.personEditForm.get('currentLocationCity').value;
    }

    if (this.personEditForm.get('birthLocationCountry').value !== this.data.privateData?.birthLocationCountry && this.personEditForm.get('birthLocationCountry').value) {
      privateChanges.birthLocationCountry = this.personEditForm.get('birthLocationCountry').value;
    }

    if (this.personEditForm.get('birthLocationCity').value !== this.data.privateData?.birthLocationCity && this.personEditForm.get('birthLocationCity').value) {
      privateChanges.birthLocationCity = this.personEditForm.get('birthLocationCity').value;
    }

    if (this.personEditForm.get('deathLocationCountry').value !== this.data.privateData?.deathLocationCountry && this.personEditForm.get('deathLocationCountry').value) {
      privateChanges.deathLocationCountry = this.personEditForm.get('deathLocationCountry').value;
    }

    if (this.personEditForm.get('deathLocationCity').value !== this.data.privateData?.deathLocationCity && this.personEditForm.get('deathLocationCity').value) {
      privateChanges.deathLocationCity = this.personEditForm.get('deathLocationCity').value;
    }

    if (this.personEditForm.get('phone').value !== this.data.privateData?.phone && this.personEditForm.get('phone').value) {
      privateChanges.phone = this.personEditForm.get('phone').value;
    }

    if (this.personEditForm.get('email').value !== this.data.privateData?.email && this.personEditForm.get('email').value) {
      privateChanges.email = this.personEditForm.get('email').value;
    }

    if (Object.keys(changes).length === 0 && changes.constructor === Object &&
    Object.keys(privateChanges).length === 0 && privateChanges.constructor === Object) {

    } else {
        this.updateProfile(this.id, changes, privateChanges);
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

  updateProfile(id: string, changes: any, privateChanges: any) {

    this.api.updateProfile(this.endpoint, id, changes, privateChanges, this.auth.getConnectedProfile())
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

