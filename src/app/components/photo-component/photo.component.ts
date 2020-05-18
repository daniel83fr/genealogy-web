import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { GraphQLService } from 'src/app/_services/GraphQLService';
import { ConfigurationService } from 'src/app/_services/ConfigurationService';
import { ImageService } from 'src/app/_services/imageService';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})

export class PhotoComponent implements OnInit, AfterContentInit {

  @Input() id = undefined;
  @Input() editable = false;
  
  photos: any[];
  photoIndex = 0;
  image: string | ArrayBuffer;
  image2: any;

  constructor(
    public configService: ConfigurationService,
    private graphQlService: GraphQLService,
    private imageService: ImageService,
    private snackBar: MatSnackBar
    ) {

  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    this.image2 = file;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
    }
    myReader.readAsDataURL(file);
  }


  upload() {


    let myHeaders = new Headers();
    myHeaders.append('Authorization', 'Client-ID 7e2fbe3383eb5ed');

    let formdata = new FormData();
    formdata.append('image', this.image2);
    formdata.append('type', 'file');
    formdata.append('name', this.image2.name);

    let requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch('https://api.imgur.com/3/image', requestOptions)
      .then(response => response.json())
      .then(result => {

        let link = result.data.link;
        let deletehash = result.data.deletehash;

        return this.configService.getApiEndpoint()
        .then(endpoint => {
        return this.graphQlService.addPhoto(endpoint, link, deletehash, [this.id]);
        })
      })
      .catch(error => {
        this.snackBar.open(error, 'close', { duration: 2000 , panelClass: ['red-snackbar']}
        );
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

  ngAfterContentInit() {
    this.getPhotos(this.id);
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

