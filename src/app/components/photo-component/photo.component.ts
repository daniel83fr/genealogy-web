import { Component, OnInit, Input, AfterContentInit, OnChanges } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { NotificationService } from 'src/app/_services/NotificationService';


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})

export class PhotoComponent implements OnInit, OnChanges {

  constructor(
    public configService: ConfigurationService,
    private graphQlService: GraphQLService,
    private notification: NotificationService
    ) {

  }

  @Input() id = undefined;
  @Input() editable = false;

  photos: any[];
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

        return this.configService.getApiEndpoint()
        .then(endpoint => {
        return this.graphQlService.addPhoto(endpoint, link, deletehash, [this.id]);
        });
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

    this.configService.getApiEndpoint()
        .then(endpoint => {
        return this.graphQlService.setProfilePicture(endpoint, user, picture);
        })
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
    this.configService.getApiEndpoint()
    .then(endpoint => {
    return this.graphQlService.removePhotoTag(endpoint, tag, photo);
    })
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

    this.configService.getApiEndpoint()
        .then(endpoint => {
        return this.graphQlService.addPhotoTag(endpoint, tag, photo);
        })
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


    this.configService.getApiEndpoint()
        .then(endpoint => {
        return this.graphQlService.deletePhoto(endpoint, picture);
        })
        .catch(err => {
          this.notification.showError('Something went wrong. please check logs for detail.');
          console.log(err);
          throw Error(err);
        })
        .then(res => {
          this.notification.showSuccess('Photo deleted.');
          window.location.reload();
        })
        ;
  }

  getProfileImage(id: string) {

    this.configService.getApiEndpoint()
    .then(endpoint => {
      return this.graphQlService.getProfilePhoto(endpoint, id);
    })
    .then(data => {
        this.profile =  data?._id;
    });

  }




  getPhotos(id: string) {
    this.configService.getApiEndpoint()
      .then(endpoint => {
        return this.graphQlService.getPhotos(endpoint, id);
      })
      .then(data => {
        this.photos = data;
      });
  }
}

