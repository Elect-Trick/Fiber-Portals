import { NewOrder } from './../interfaces/new-order';
import { LocationSearch } from '../interfaces/location-search';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Products } from '../interfaces/products';
import { OrderStatus } from '../interfaces/order-status';
import { Location } from '../interfaces/location';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseURL = "https://localhost/xampp/orders.php";

  constructor(private http: HttpClient) { }

  findLocation(data: LocationSearch):Observable<any>{
   return  this.http.get<any>(`${this.baseURL}?find-location=${JSON.stringify(data)}`);
  }
  findLocationwithID(location:Location):Observable<any>{
    return  this.http.get<any>(`${this.baseURL}?fetch-location=${JSON.stringify(location)}`);
  }
  fetchProducts(){
    return this.http.get<Products[]>(`${this.baseURL}?products`);
  }

  placeOrder(data:NewOrder):Observable<any>{
    return this.http.post<any>(`${this.baseURL}?place-order`,data);
  }
  orderStatus(order:OrderStatus):Observable<any>{
    return  this.http.get<any>(`${this.baseURL}?order-status=${JSON.stringify(order)}`);
  }
  rejectOrder(order: string){
    return this.http.patch<any>(`${this.baseURL}?reject-order`,order);
  }

  addLocation(location: any){
    return this.http.post<any>(`${this.baseURL}?add-location`,location);
  }
}
