import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
 env = ""
  constructor(private http: HttpClient) { 
    this.getEnvironnementt().subscribe(res=>{
        this.env = res
      });
  }
 

  getEnvironnementt(): Observable<any> {
    const cachedEnv = sessionStorage.getItem('Environnement');
    if(cachedEnv!= null){
      return of(cachedEnv)
     }
  
    return this.http.get('/info/env').pipe(
      map(res =>{
        let env =  res["Environnement"]
        sessionStorage.setItem('Environnement', env);
        return env;
      }));
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
