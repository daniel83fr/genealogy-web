import { Component, OnInit, Input, OnChanges, Inject, PLATFORM_ID, APP_ID, SimpleChange, SimpleChanges } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NotificationService } from 'src/app/_services/NotificationService';
import { AuthenticationService } from 'src/app/_services/AuthenticationService';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Console } from 'console';
import Logger from 'src/app/utils/logger';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  @Input() profileData: any = {};
  profileDataNew: any = {};
  @Input() editable = false;
  endpoint: string;
  changes: any = {};

  personEditForm: FormGroup = null;
  editMode = false;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,
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
      weddingDate: '',
      weddingLocationCountry: '',
      weddingLocationCity: ''
    });
    
    this.endpoint = this.state.get(STATE_KEY_API, '');
    this.onValueChanges();

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
  
    this.personEditForm = this.fb.group({
      id: this.data?._id,
      firstName: this.profileDataNew?.firstName,
      lastName: this.profileDataNew?.lastName,
      gender: this.profileDataNew?.gender,
      yearOfBirth: this.profileDataNew?.yearOfBirth,
      birthDate: this.profileDataNew?.birthDate,
      yearOfDeath: this.profileDataNew?.yearOfDeath,
      deathDate: this.profileDataNew?.deathDate,
      isDead: this.profileDataNew?.isDead ?? false,
      currentLocationCountry: this.profileDataNew?.currentLocationCountry,
      birthLocationCountry: this.profileDataNew?.birthLocationCountry,
      deathLocationCountry: this.profileDataNew?.deathLocationCountry,
      currentLocationCity: this.profileDataNew?.currentLocationCity,
      birthLocationCity: this.profileDataNew?.birthLocationCity,
      deathLocationCity: this.profileDataNew?.deathLocationCity,
      email: this.profileDataNew?.email,
      phone: this.profileDataNew?.phone,
      weddingDate: this.profileDataNew?.weddingDate,
      weddingLocationCountry: this.profileDataNew?.weddingLocationCountry,
      weddingLocationCity: this.profileDataNew?.weddingLocationCity,
    });
    this.onValueChanges();
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


  public syncChanges():void{

    for (var key in this.profileDataNew) {
      if(this.profileData[key] != this.personEditForm.get(key).value){
        console.log(key)
        this.changes[key] = this.personEditForm.get(key).value;
      }
      else{
        delete this.changes[key];
      }
    }
  }

  onValueChanges(): void {
  //   this.personEditForm.valueChanges
  //   .pipe(
  //     debounceTime(2000),
  //     distinctUntilChanged()
  // )
  // .subscribe(val=>{
  //       for (var key in this.profileDataNew) {
  //         if(this.profileData[key] != val[key]){
  //           console.log(key)
  //           this.changes[key] = val[key];
  //         }
  //       }})
  }

  ngOnInit(): void {

    

// this.personEditForm.valueChanges.subscribe(x => {

//   //this.changes = [];
//   const keys = Object.keys(this.profileDataNew);
//   for (var key in keys) {
//     if(this.profileData[key] != this.profileDataNew[key]){
//       this.changes[key] = this.profileDataNew[key];
//     }
//   }
// }

//)
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

    if (this.personEditForm.get('weddingDate').value !== this.data.privateData?.weddingDate && this.personEditForm.get('weddingDate').value) {
      privateChanges.weddingDate = this.personEditForm.get('weddingDate').value;
    }
    if (this.personEditForm.get('weddingLocationCountry').value !== this.data.privateData?.weddingLocationCountry && this.personEditForm.get('weddingLocationCountry').value) {
      privateChanges.weddingLocationCountry = this.personEditForm.get('weddingLocationCountry').value;
    }

    if (this.personEditForm.get('weddingLocationCity').value !== this.data.privateData?.weddingLocationCity && this.personEditForm.get('weddingLocationCity').value) {
      privateChanges.weddingLocationCity = this.personEditForm.get('weddingLocationCity').value;
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

