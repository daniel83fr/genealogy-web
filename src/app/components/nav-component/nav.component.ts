import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  env = ''
  constructor(private http: HttpClient) { 
    this.http.get(window.location.origin + '/info/env').pipe(
      map(res =>{
        return  res["Environnement"]
      })).subscribe(res=>{
        this.env = res
      });
  }
 
  isConnected = false;
  connectedUser = "";
  ngOnInit(): void {
  }

  logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("login")
    window.location.reload();
  }

  ngAfterContentInit() {
    this.isConnected = localStorage.getItem("token") != null
    this.connectedUser = localStorage.getItem("login")
    
  }
}
