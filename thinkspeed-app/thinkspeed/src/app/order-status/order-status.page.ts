import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { User } from '../interfaces/user';
import { OrdersService } from '../services/orders.service';
import { OrderStatus } from '../interfaces/order-status';
import { OverlayEventDetail } from '@ionic/core/components';
import {
  AlertController,
  IonModal,
  LoadingController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.page.html',
  styleUrls: ['./order-status.page.scss'],
})
export class OrderStatusPage implements OnInit, OnDestroy {
  user!: User;
  orderSelected!: boolean;

  users: User[] = [];
  isOpen!: boolean;
  orderSub!: Subscription;
  orders: OrderStatus[] = [];
  orderStatus: OrderStatus = {
    order_type: 0,
    order_number: '',
    order_status: 0,
    product: 0,
    creation_date: 0,
    location_id: 0,
    client_name: '',
    client_surname: '',
    client_email: '',
    contact_number: '',
    isp_reference: '',
    organization_id: 0,
    network_id: '',
    location_type:''
  };
  selectedOrder: OrderStatus = {
    order_type: 0,
    order_number: '',
    order_status: 0,
    product: 0,
    creation_date: 0,
    location_id: 0,
    client_name: '',
    client_surname: '',
    client_email: '',
    contact_number: '',
    isp_reference: '',
    organization_id: 0,
    network_id: '',
    location_type:''
  };
  rejectable = false;
  @ViewChild('popover') popover: any;
  @ViewChild(IonModal) modal!: IonModal;
  name!: string;
  orderLoaded!: boolean;

  constructor(
    private orderService: OrdersService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}
  ngOnDestroy(): void {
    this.orders = [];
    this.users = [];
    this.orderStatus = {
      order_type: 0,
      order_number: '',
      order_status: 0,
      product: 0,
      creation_date: 0,
      location_id: 0,
      client_name: '',
      client_surname: '',
      client_email: '',
      contact_number: '',
      isp_reference: '',
      organization_id: 0,
      network_id: ''
      ,location_type:''
    };
    this.selectedOrder = {
      order_type: 0,
      order_number: '',
      order_status: 0,
      product: 0,
      creation_date: 0,
      location_id: 0,
      client_name: '',
      client_surname: '',
      client_email: '',
      contact_number: '',
      isp_reference: '',
      organization_id: 0,
      network_id: '',
      location_type:''
    };
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }

  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
    });
    return await loader.present();
  }

  ngOnInit() {
    this.presentLoader().then(() => {
      this.loadingCtrl.dismiss();
    });
  }
  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<string>>;
  //   if (ev.detail.role === 'confirm') {
  //   }
  // }

  async findOrder(order: OrderStatus) {
    this.orderSub = this.orderService.orderStatus(order).subscribe({
      next: (data) => {
        if (data?.length >0 && data != null) {
          this.orders = data;
        } else {
          this.clearData();
        }
      },
      error: (error) => {
      },
      complete: () => {},
    });
  }
  search(event: any) {
    if (event.detail.value == '') {
      this.orderSelected = false;
    }
    this.orderStatus.order_number = event.detail.value;
    this.orderStatus.order_type = event.detail.value.slice(0, 3);
    this.findOrder(this.orderStatus);
  }
  clearSearch(event: any) {
    this.orderLoaded = false;
    if (event.detail.value === '') {
      this.orderSelected = false;
      this.orders = [];
    }
    this.orderSelected = false;
    this.selectedOrder = {
      order_type: 0,
      order_number: '',
      order_status: 0,
      product: 0,
      creation_date: 0,
      location_id: 0,
      client_name: '',
      client_surname: '',
      client_email: '',
      contact_number: '',
      isp_reference: '',
      organization_id: 0,
      network_id: '',
      location_type:''
    };
    this.orders = [];
    this.orderLoaded = false;
  }
  fetchRoleNames(role: string) {}
  fetchOrderStatus(order_status: number) {
    return Status[order_status];
  }
  fetchProducts(product: number) {
    return Products[product];
  }

  presentPopover(event: any, order: OrderStatus) {
    this.selectedOrder = order;
    this.popover.event = event;
    this.isOpen = true;
  }
  viewOrder(order: OrderStatus) {
    this.orderSelected = true;
    this.selectedOrder = order;
    this.rejectable = this.selectedOrder.order_status > 1 ? false : true;
  }
  rejectOrder(selectedOrder: OrderStatus) {
    this.presentRejectAlert().then(() => {
      // Present toast confirmation of rejection
    });
  }

  async presentToast(_message: string, _header: string) {
    const toast = this.toastCtrl.create({
      header: _header,
      duration: 2000,
      message: _message,
      position: 'middle',
    });
    return await (await toast).present();
  }

  async presentRejectAlert() {
    const alert = this.alertCtrl.create({
      header: 'Cancel Order',
      message: 'Are you sure you want to reject the order?',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.presentLoader().then(() => {
              this.orderService
                .rejectOrder(this.selectedOrder.order_number)
                .subscribe({
                  next: (data) => {
                    this.loadingCtrl.dismiss();
                    switch (data) {
                      case true:
                        this.presentToast(
                          'Order has been rejected',
                          'Success!'
                        ).then(() => {
                          this.clearData();
                        });
                        break;

                      default:
                        break;
                    }
                  },
                });
            });
          },
          role: 'ok',
        },
        { text: 'Cancel', handler: () => {}, role: 'cancel' },
      ],
    });
    return await (await alert).present();
  }

  clearData() {
    this.orders = [];
    this.users = [];
    this.orderStatus = {
      order_type: 0,
      order_number: '',
      order_status: 0,
      product: 0,
      creation_date: 0,
      location_id: 0,
      client_name: '',
      client_surname: '',
      client_email: '',
      contact_number: '',
      isp_reference: '',
      organization_id: 0,
      network_id: '',
      location_type:''
    };
    this.orderLoaded = false;
    this.orderSelected = false;
    this.isOpen = false;

    this.selectedOrder = {
      order_type: 0,
      order_number: '',
      order_status: 0,
      product: 0,
      creation_date: 0,
      location_id: 0,
      client_name: '',
      client_surname: '',
      client_email: '',
      contact_number: '',
      isp_reference: '',
      organization_id: 0,
      network_id: '',
      location_type:''
    };
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
