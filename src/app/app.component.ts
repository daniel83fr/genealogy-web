import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GenealogyFrontEnd';
  env = 'Staging...'

  constructor(private http: HttpClient) { 
    this.http.get(window.location.origin + '/info/env').pipe(
      map(res =>{
        return  res["Environnement"]
      })).subscribe(res=>{
        this.env = res
      });
  }
  

}
