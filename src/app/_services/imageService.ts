import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


interface ImageInfo {
  title: string;
  description: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})

export class ImageService {
  private images: object[] = [];
  private url = 'https://api.imgur.com/3/image';
  private clientId = '7e2fbe3383eb5ed';
  imageLink: any;


  constructor(private http: HttpClient) { }

  async uploadImage(imageFile: File, infoObject: {}) {
    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    const header = new HttpHeaders({
      'authorization': 'Client-ID ' + this.clientId
    });

    const imageData = await this.http.post(this.url, formData, {headers: header}).toPromise();
    this.imageLink = imageData['data'].link;

    const newImageObject: ImageInfo = {
      title: infoObject['title'],
      description: infoObject['description'],
      link: this.imageLink
    };

    this.images.unshift(newImageObject);

  }

  getImages() {
    return this.images;
  }
}
