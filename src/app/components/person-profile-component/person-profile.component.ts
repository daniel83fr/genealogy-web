import { Component, OnInit, Input } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.css']
})

export class PersonProfileComponent implements OnInit {

  @Input() id = '';

  @Input() data: any = {};
  @Input() privateData: any = {};
  @Input() editable = false;

  personEditForm: FormGroup = null;
  editMode = false;
  constructor(
    public rest: ConfigurationService,
    private api: GraphQLService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.personEditForm = this.fb.group({
      id: '',
      firstName: '',
      lastName: '',
      gender: '',
      yearOfBirth: '',
      birthDate: ''
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
    this.personEditForm = this.fb.group({
      id: this.data?._id,
      firstName: this.data?.firstName,
      lastName: this.data?.lastName,
      gender: this.data?.gender,
      yearOfBirth: this.data?.yearOfBirth,
      birthDate: this.privateData?.birthDate
    });
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

    const privateChanges: any = {};
    if (this.personEditForm.get('birthDate').value !== this.data.privateData && this.personEditForm.get('birthDate').value) {
      privateChanges.birthDate = this.personEditForm.get('birthDate').value;
    }
    
    if (Object.keys(changes).length === 0 && changes.constructor === Object &&
    Object.keys(privateChanges).length === 0 && privateChanges.constructor === Object) {

    } else {
      this.rest.getApiEndpoint().then((endpoint) => {
        this.updateProfile(this.id, changes, privateChanges);
      });
    }
  }

  deleteProfile() {
    const r = confirm(`Delete ${this.data._id}?`);
    if (r === true) {
      // OK

      this.rest.getApiEndpoint()
        .then((endpoint) => {
          return this.api.deleteProfile(endpoint.toString(), this.id);
        })
        .then(res => {
          console.log(res.data);
          this.snackBar.open(res.data.removeProfile, 'close', { duration: 5000 });
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
    this.rest.getApiEndpoint()
      .then((endpoint) => {
        return this.api.updateProfile(endpoint, id, changes, privateChanges);
      })
      .then(res => {
        this.snackBar.open('Profile updated.', 'close', { duration: 5000 });
        location.reload();
      })
      .catch(err => {
        alert(err);
      }
      );

  }
}
