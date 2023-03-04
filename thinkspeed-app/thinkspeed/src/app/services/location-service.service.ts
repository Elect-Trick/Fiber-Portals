import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationServiceService {
  baseURL = 'https://localhost/xampp/manage-locations.php';
  constructor(private http: HttpClient) {}

  fetchMdus(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?fetch-mdus`);
  }
}
