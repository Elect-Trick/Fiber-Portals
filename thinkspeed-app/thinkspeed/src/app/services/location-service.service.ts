import { LocationEntity } from '../interfaces/location-entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocationSearch } from '../interfaces/location-search';

@Injectable({
  providedIn: 'root',
})
export class LocationServiceService {
  baseURL = 'https://localhost/xampp/manage-locations.php';
  constructor(private http: HttpClient) {}

  paginatedMdus(page: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?paginated-mdus=${page}`);
  }
  paginatedSdus(page: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?paginated-sdus=${page}`);
  }
  allSdus(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?fetch-all-sdus`);
  }
  // findSdu(data: LocationSearch): Observable<any> {
  //   return this.http.get<any>(`${this.baseURL}?find-location=${JSON.stringify(data)}`);
  // }

  findLocation(data:LocationSearch):Observable<any>{
    return this.http.get<any>(`${this.baseURL}?find-location=${JSON.stringify(data)}`);
  }
  retrieveUnits(data:LocationEntity):Observable<any>{
    return this.http.get<any>(`${this.baseURL}?retrieve-sdunits=${JSON.stringify(data)}`);


  }
}
