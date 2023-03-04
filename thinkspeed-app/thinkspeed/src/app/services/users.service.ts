import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseURL = "https://localhost/xampp/";

  constructor(private http: HttpClient) { }

  registerUser(data:any):Observable<any>{
    return this.http.post(`${this.baseURL}thinkspeed.php?add-user`,data);



  }
  manageUsers():Observable<any>{
    return this.http.get<any>(`${this.baseURL}thinkspeed.php?manage-users`);
  }
  deleteUser(user:string):Observable<any>{
    return this.http.delete(`${this.baseURL}thinkspeed.php?delete-user=${user}`);

  }

  countUsers():Observable<any>{
    return this.http.get<any>(`${this.baseURL}thinkspeed.php?count-users`);
  }
  getPaginatedUsers(page:number){
    return this.http.get<any>(`${this.baseURL}thinkspeed.php?paginated-users=${page}`);

  }

}
