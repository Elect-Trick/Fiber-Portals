import { HttpResponse } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
public token!:string;
tokenSource = new ReplaySubject<any>(1);
token$ = this.tokenSource.asObservable();
data = false;
baseURL = "https://localhost/xampp/";

  constructor(private http : HttpClient) {

   }
   refreshToken():Observable<HttpResponse>{
    return this.http.get<HttpResponse>(`${this.baseURL}thinkspeed.php?refreshToken`);
   }

  login(data: any):Observable<HttpResponse>{

    return this.http.post<HttpResponse>(`${this.baseURL}login.php?login`,data);
  }

  getAllUserRoles():Observable<any>{
  return  this.http.get<any>(`${this.baseURL}thinkspeed.php?getAllUserRoles`);

  }

  getOrginzations():Observable<any>{
    return this.http.get<any>(`${this.baseURL}organizations.php?getOrganizations`);
  }

  loggedIn(){

 let data = localStorage.getItem('token');
    this.tokenSource.next(data);
  }
  setToken(data: any) {
    localStorage.removeItem('token');
    const token = localStorage.setItem('token', data as any);
  }

  signOut(){
    localStorage.clear();
    this.tokenSource.next(null as any);
  }

}
