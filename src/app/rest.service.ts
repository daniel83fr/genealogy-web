import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RestService {

  endpoint = ""

  constructor(private http: HttpClient) { 
  }

  
  getApiEndpoint(): Observable<any> {

     if(this.endpoint != ''){
      return of(this.endpoint)
     }

    return this.http.get(window.location.origin + '/info/api').pipe(
      map(res =>{
        this.endpoint =  res["GENEALOGY_API"]
        return this.endpoint;
      }));
  }


  getUnusedPersons(endpoint:string) {
    return this.http.get(endpoint + 'admin/person/unused').pipe(
      map(this.extractData));
  }

  searchPersons(endpoint:string, query:string) {
    
        return this.http.get(endpoint + 'search?query='+ query).pipe(
          map(this.extractData));
  }
 

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
  
 


  removePerson(endpoint:string,id:string):any {

    var url = endpoint + "person" + "/" + id;
    return this.http.delete(decodeURIComponent(url) )

  }
  removeParentLink(endpoint:string,idChild:string, idParent:string) {

    var url = endpoint + "person" + "/" + idChild + '/' + "relation"+ '/' +idParent;
    this.http.delete(decodeURIComponent(url) )
    .toPromise()
    .then(res=>{
      console.log("OK")
    })
    .catch(err=>{
      console.log(err)
    });

  }

  removeSpouseLink(endpoint:string,idPerson1:string, idPerson2:string) {

    var url = endpoint + "person" + "/" + idPerson1 + '/' + "relation"+ '/' +idPerson2;
    this.http.delete(decodeURIComponent(url) )
    .toPromise()
    .then(res=>{
      console.log("OK")
    })
    .catch(err=>{
      console.log(err)
    });

  }

  addParentLink(endpoint:string, idChild:string, idParent:string): void {
    var url = endpoint + "person" + "/" + idParent + '/' + "parent"+ '/' +idChild;
    this.http.put(url , {})
    .toPromise()
    .then(res=>{
      console.log("OK")
    })
    .catch(err=>{
      console.log(err)
    });
  }


  createPerson(endpoint:string, lastName:string, firstName:string, gender:string): any {
    var url = endpoint + "person" ;
    var body = {
      "FirstName" : firstName,
      "LastName" : lastName,
      "Gender" : gender
    }
    return this.http.put(url , body )
    // .toPromise()
    // .then(res=>{
    //   console.log(res)
    //   return res.toString();
    // })
    // .catch(err=>{
    //   console.log(err)
    // });
  }

  addSpouseLink(endpoint:string, idPerson1:string, idPerson2:string): void {
    var url = endpoint + "person" + "/" + idPerson1 + '/' + "spouse"+ '/' +idPerson2;
    this.http.put(url , {})
    .toPromise()
    .then(res=>{
      console.log("OK")
    })
    .catch(err=>{
      console.log(err)
    });
  }

  updatePerson(endpoint:string, id:string, data:object): void {
    this.http.patch(endpoint + 'person/'+id, data) .toPromise()
    .then(res =>{
      console.log("Done")
    } )
    .catch(this.handleError);
  }

  getPersonDetail(endpoint:string, id:string): Observable<any> {
    return this.http.get(endpoint + 'person/'+id).pipe(
      map(this.extractData));
  }
  
  getPersonFull(endpoint:string, id:string): Observable<any> {
    return this.http.get(endpoint + 'person/'+id+'/full').pipe(
      map(this.extractData));
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}