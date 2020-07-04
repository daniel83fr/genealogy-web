import { Component, OnInit, Input, AfterContentInit, OnChanges, Inject, PLATFORM_ID, APP_ID } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { NotificationService } from 'src/app/_services/NotificationService';
import { makeStateKey, TransferState } from '@angular/platform-browser';

const STATE_KEY_API = makeStateKey('api');

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})

export class PhotoComponent implements OnInit, OnChanges {

  endpoint: string;

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    private graphQlService: GraphQLService,
    private notification: NotificationService
  ) {
    this.endpoint = this.state.get(STATE_KEY_API, '');
  }

  switchEdit() {
    this.editMode = !this.editMode;
  }

  @Input() id = undefined;
  @Input() editable = false;
  @Input() photos: any[];
  editMode = false;




  photoIndex = 0;
  image: string | ArrayBuffer;
  image2: any;
  profile: any;

  persons: any[] = [];
  linkId;
  edit = false;

  setLink(option: any) {
    this.linkId = option._id;
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    this.image2 = file;
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
    };
    myReader.readAsDataURL(file);
  }


  upload() {


    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Client-ID 7e2fbe3383eb5ed');

    const formdata = new FormData();
    formdata.append('image', this.image2);
    formdata.append('type', 'file');
    formdata.append('name', this.image2.name);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch('https://api.imgur.com/3/image', requestOptions)
      .then(response => response.json())
      .then(result => {

        const link = result.data.link;
        const deletehash = result.data.deletehash;

        return this.graphQlService.addPhoto(this.endpoint, link, deletehash, [this.id]);

      })
      .then(res => {
        this.notification.showSuccess('Photo added');
        window.location.reload();
      })
      .catch(error => {
        console.log(Error(error));
        this.notification.showError('Something went wrong. please check logs for details.');
      });
  }

  setProfilePicture() {

    const picture = this.photos[this.photoIndex]._id;
    const user = this.id;

    this.graphQlService.setProfilePicture(this.endpoint, user, picture)
      .catch(err => {
        this.notification.showError('Something went wrong. please check logs for detail.');
        console.log(err);
        throw Error(err);
      })
      .then(res => {
        this.notification.showSuccess('Profile picture changed.');
        window.location.reload();
      })
      ;
  }

  removeTag(tag: string, photo: string) {
    this.graphQlService.removePhotoTag(this.endpoint, tag, photo)
      .catch(err => {
        this.notification.showError('Something went wrong. please check logs for detail.');
        console.log(err);
        throw Error(err);
      })
      .then(res => {
        this.notification.showSuccess('Tag removed');
        window.location.reload();
      });
  }

  addTag(tag: string, photo: string) {

    if (tag.length < 12) {
      this.notification.showError('Id should be valid');
      return;
    }

    this.graphQlService.addPhotoTag(this.endpoint, tag, photo)
      .catch(err => {
        this.notification.showError('Something went wrong. please check logs for detail.');
        console.log(err);
        throw Error(err);
      })
      .then(res => {
        this.notification.showSuccess('Tag added');
        this.linkId = '';
        window.location.reload();
      });
  }

  next() {
    if (this.photoIndex < this.photos.length - 1) {
      this.photoIndex++;
    }
  }

  previous() {
    if (this.photoIndex > 0) {
      this.photoIndex--;
    }
  }
  ngOnInit(): void {
  }

  ngOnChanges() {


    this.getProfileImage(this.id);
    this.getPhotos(this.id);
  }

  deletePicture() {

    const picture = this.photos[this.photoIndex]._id;


    this.graphQlService.deletePhoto(this.endpoint, picture)
      .catch(err => {
        this.notification.showError('Something went wrong. please check logs for detail.');
        console.log(err);
        throw Error(err);
      })
      .then(res => {
        this.notification.showSuccess('Photo deleted.');
        window.location.reload();
      });
  }

  getProfileImage(id: string) {
    this.graphQlService.getProfilePhoto(this.endpoint, id)
      .then(data => {
        this.profile = data?._id;
      });
  }

  getPhotos(id: string) {
    this.graphQlService.getProfile(this.endpoint, id)
      .then(data => {
        this.photos = data.photos;
      });
  }
}
