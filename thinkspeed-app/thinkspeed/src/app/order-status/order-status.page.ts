import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { User } from '../interfaces/user';
import { OrdersService } from '../services/orders.service';
import { OrderStatus } from '../interfaces/order-status';
import { Order } from '../interfaces/order';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.page.html',
  styleUrls: ['./order-status.page.scss'],
})
export class OrderStatusPage implements OnInit, OnDestroy {
  user!: User;
  selectedOrder!: Order;
  users: User[] = [];
  isOpen!: boolean;
  orderSub!: Subscription;
  orders: Order[] = [];
  orderType: OrderStatus = {
    order_type: '',
    order_number: '',
  };
  @ViewChild('popover') popover: any;

  constructor(private orderService: OrdersService) {}
  ngOnDestroy(): void {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }

  ngOnInit() {}
  search(event: any) {
    this.orderType.order_number = event.detail.value;
    this.orderType.order_type = event.detail.value.slice(0, 3);
    this.orderSub = this.orderService.orderStatus(this.orderType).subscribe({
      next: (data) => {
        console.log('Data has ', data);
        this.orders = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
    console.log('Order type ', this.orderType.order_type);
  }
  clearSearch(event: any) {}
  fetchRoleNames(role: string) {}
  fetchOrderStatus(order_status: string) {
    return Status[parseInt(order_status)];
  }
  fetchProducts(product: string) {
    return Products[parseInt(product)];
  }

  presentPopover(event: any, order: Order) {
   this.selectedOrder = order;
    this.popover.event = event;
    this.isOpen = true;
  }
  viewOrder(order: Order) {

  }
}
enum Status {
  'Pending' = 1,
  'Awaiting Activation' = 2,
  'Cancelled' = 3,
  'Active' = 4,
}
enum Products {
  'FTTH- 25/25Mbps' = 1,
  'FTTH- 50/50Mbps' = 2,
  'FTTH- 100/100Mbps' = 3,
  'FTTH- 200/200Mbps' = 4,
}
