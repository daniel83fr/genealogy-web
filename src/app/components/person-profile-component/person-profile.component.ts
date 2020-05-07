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

  @Input('id')
  id: string = "";

  @Input("data")
  data: any = {}

  @Input('editable')
  editable: boolean = false;

  personEditForm: FormGroup = null;
  editMode = false;
  constructor(
    public rest: ConfigurationService,
    private api: GraphQLService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ){
    this.personEditForm = this.fb.group({
      'id': '',
      'firstName': '',
      'lastName': '',
      'gender': '',
      'birthDate': ''
    })
  }

  ngOnInit(): void {
    this.personEditForm = this.fb.group({
      'id': this.data._id,
      'firstName': this.data.FirstName,
      'lastName': this.data.LastName,
      'gender': this.data.Gender,
      'birthDate': this.data.YearOfBirth
    })

  }

  ngAfterContentInit() {

  }

  onSubmit() {
    var changes = {}
    if (this.personEditForm.get('firstName').value != this.data.FirstName) {
      changes['FirstName'] = this.personEditForm.get('firstName').value;
    }
    if (this.personEditForm.get('lastName').value != this.data.LastName) {
      changes['LastName'] = this.personEditForm.get('lastName').value;
    }
    if (this.personEditForm.get('gender').value != this.data.Gender) {
      changes['Gender'] = this.personEditForm.get('gender').value;
    }
    if (this.personEditForm.get('birthDate').value != this.data.BirthDate) {
      changes['BirthDate'] = this.personEditForm.get('birthDate').value;
    }

    if (Object.keys(changes).length === 0 && changes.constructor === Object) {

    }
    else {
      this.rest.getApiEndpoint().subscribe((endpoint) => {
        this.updateProfile(this.id, changes)
        alert("Updated")
      })
    }
  }

deleteProfile() {
  var r = confirm(`Delete ${this.data._id}?`);
  if (r == true) {
    //OK
    this.rest.getApiEndpoint().subscribe((endpoint) => {
      this.api.deleteProfile(endpoint, this.id)
      .subscribe(res => {
        console.log(res.data);
        this._snackBar.open(res.data.removeProfile,'close', { duration : 5000})
        window.location.href = "/"
      });
    }
    )
  }
}

getDisplayName(person: any) {
  let maidenName = person?.MaidenName;
  if (!!maidenName) {
    maidenName = ` (${maidenName})`
  }


  return `${person?.FirstName} ${person?.LastName} ${maidenName ?? ""}`
}



onChange(value: MatSlideToggleChange) {
  this.editMode = value.checked
}

canEdit() {
  return this.editMode && this.editable
}

updateProfile(id: string, changes: any) {
  this.rest.getApiEndpoint().subscribe((endpoint) => {
    this.api.updateProfile(endpoint, id, changes).subscribe(res => {
      console.log(res.data);
      alert(res.data.updatePerson)
      location.reload();
    });
  }
  )
}
}

