import { HttpResponse } from '@capacitor/core';
import { NewOrder } from './../interfaces/new-order';
import { LocationSearch } from '../interfaces/location-search';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Products } from '../interfaces/products';
import { OrderStatus } from '../interfaces/order-status';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseURL = "https://localhost/xampp/orders.php";

  constructor(private http: HttpClient) { }

  findLocation(data: LocationSearch):Observable<any>{
   return  this.http.get<any>(`${this.baseURL}?find-location=${JSON.stringify(data)}`);
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
}
