import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ServiceSearch } from '../interfaces/service-search';
import { ServiceHistory } from '../interfaces/service-history';
import { Regrade } from '../interfaces/regrade';

@Injectable({
  providedIn: 'root',
})
export class ManageServicesService {
  baseURL = 'https://localhost/apis/clearaccess/manage-services.php';

  constructor(private http: HttpClient) {}

  findService(data: ServiceSearch): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}?find-service=${JSON.stringify(data)}`
    );
  }

  regrade(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}?regrade`, data);
  }
  cancelRegrade(regrade: Regrade): Observable<any> {
    return this.http.patch(
      `${this.baseURL}?cancel-regrade`,
      JSON.stringify(regrade)
    );
  }

  fetchServiceHistory(data: ServiceHistory): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}?service-history=${JSON.stringify(data)}`
    );
  }

}
