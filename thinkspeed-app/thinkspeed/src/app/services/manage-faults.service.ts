import { OutageComment } from './../interfaces/outage-comment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Ticket } from '../interfaces/ticket';
import { Location } from '../interfaces/location';
import { Comment } from '../interfaces/comment';
import { LocationSearch } from '../interfaces/location-search';
import { Outage } from '../interfaces/outage';
@Injectable({
  providedIn: 'root',
})
export class ManageFaultsService {
  baseURL = 'https://localhost/apis/clearaccess/manage-tickets.php';
  constructor(private http: HttpClient) {}

  fetchFaultTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?fetch-fault-types`);
  }

  logTicket(ticket: Ticket): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}?log-ticket`,
      JSON.stringify(ticket)
    );
  }

  getLocationTickets(location: Location): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}?location-tickets=${JSON.stringify(location)}`
    );
  }
  postComment(comment: Comment): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}?post-comment`,
      JSON.stringify(comment)
    );
  }

  fetchComments(ticket: Ticket): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}?fetch-comments=${JSON.stringify(ticket)}`
    );
  }
  acceptResolution(ticket: Ticket): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}?accept-resolution`,
      JSON.stringify(ticket)
    );
  }
  markasResolved(ticket: Ticket) {
    return this.http.patch(
      `${this.baseURL}?mark-as-resolved`,
      JSON.stringify(ticket)
    );
  }
  fetchTicketbyID(data: LocationSearch): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}?find-ticket=${JSON.stringify(data)}`
    );
  }
  fetchTechnicians(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?fetch-technicians`);
  }

  countTickets() {
    return this.http.get<any>(`${this.baseURL}?count-tickets`);
  }
  countClosedTickets() {
    return this.http.get<any>(`${this.baseURL}?count-closed-tickets`);
  }

  getPaginatedTickets(page: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?paginated-tickets=${page}`);
  }
  PaginatedClosedTickets(page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}?paginated-closed-tickets=${page}`
    );
  }
  assignTicket(ticket: Ticket): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}?assign-ticket`,
      JSON.stringify(ticket)
    );
  }

  fetchAllTickets(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?all-open-tickets`);
  }
  fetchClosedTickets(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?all-closed-tickets`);
  }

  logOutage(outage: Outage): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}?log-outage`,
      JSON.stringify(outage)
    );
  }
  getPaginatedOutages(page: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?paginated-outages=${page}`);
  }

  closeOutage(outage: Outage): Observable<any> {
    return this.http.patch(
      `${this.baseURL}?close-outage`,
      JSON.stringify(outage)
    );
  }
  postIncidentUpdate(comment: OutageComment): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}?post-incident-update`,
      JSON.stringify(comment)
    );
  }
  fetchIncidentComments(outage: Outage): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}?fetch-incident-comments=${JSON.stringify(outage)}`
    );
  }

  fetchClosedOutages(page: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?closed-outages=${page}`);
  }
  findOutage(outage: LocationSearch): Observable<any> {
    return this.http.get<any>(`${this.baseURL}?find-outage=${JSON.stringify(outage)}`);
  }

}
