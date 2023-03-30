import { ProcessOrderPage } from './../process-order/process-order.page';
import { EditOrderPage } from './../edit-order/edit-order.page';
import { LoginService } from 'src/login.service';
import { Event, Router } from '@angular/router';
import { OrderStatus } from './../interfaces/order-status';
import { OrdersService } from './../services/orders.service';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
  ViewDidLeave,
  ViewWillLeave,
} from '@ionic/angular';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  EventEmitter,
  Output,
} from '@angular/core';
import { ENUMS } from '../Helpers/globalEnums';
import { Location } from '../interfaces/location';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.page.html',
  styleUrls: ['./manage-orders.page.scss'],
})
export class ManageOrdersPage implements OnInit, OnDestroy, ViewDidLeave {
  type = 'pending';
  orders: OrderStatus[] = [];
  selectedLocation: Location = {
    location_id: 0,
    location_string: '',
    location_type: '',
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
    location_type: '',
  };
  modalOpen = false;
  timeoutId!: any;
  @Output() emitter = new EventEmitter<boolean>();
  constructor(
    private loadingCtrl: LoadingController,
    private orderService: OrdersService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: EditOrderPage,
      componentProps: {
        selectedOrder: this.selectedOrder,
        closeModal: this.emitter,
      },
    });
    modal.present().then((result: any) => {
      this.emitter.subscribe(() => {
        this.modalCtrl.dismiss();
      });
    });
  }

  async processOrder(order:OrderStatus){
    const modal = await this.modalCtrl.create({
      component: ProcessOrderPage,
      componentProps: {
        selectedOrder: order,
        closeModal: this.emitter,
      },
    });
    modal.present().then((result: any) => {
      this.emitter.subscribe(() => {
        this.modalCtrl.dismiss();
      });
    });

  }

  ionViewDidLeave(): void {
    // this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.presentLoader().then(() => {
      this.getPendingOrders(1).then(() => {
        this.loadingCtrl.dismiss();
      });
    });
  }
  selectOrder(event: any) {
    if (event.detail.value != undefined) {
      this.presentLoader().then(() => {
        this.selectedOrder = this.orders.find((z) =>
          z.order_number.includes(event.detail.value)
        ) as OrderStatus;
        this.selectedLocation.location_id = this.selectedOrder.location_id;
        this.selectedLocation.location_string =
          this.selectedOrder.location_type;
        this.findLocation(this.selectedLocation).then(() => {
          this.loadingCtrl.dismiss();
        });

        console.log(this.selectedOrder);
      });
    }
  }

  async findLocation(location: Location) {
    this.orderService.findLocationwithID(this.selectedLocation).subscribe({
      next: (response) => {
        if (response) {
          this.selectedLocation.location_string = response;
        }
      },
    });
  }

  async getPendingOrders(page: number) {
    this.orderService.fnoPendingOrders(page).subscribe({
      next: (response) => {
        if (response) {
          this.orders = response;
        }
      },
    });
  }

  async getActiveOrders(page: number) {
    this.orderService.fnoActiveOrders(page).subscribe({
      next: (response) => {
        if (response) {
          this.orders = response;
        }
      },
    });
  }

  async fetchAwaitingInstallation(page: number) {
    this.orderService.fetchAwaitingInstallation(page).subscribe({
      next: (response) => {
        if (response) {
          this.orders = response;
        }
      },
    });
  }

  async presentAlert(_message: string, order: OrderStatus) {
    const alert = await this.alertCtrl.create({
      message: _message,
      header: 'Terminate Order',

      buttons: [
        {
          role: 'ok',
          text: 'Confirm',
          handler: () => {
            this.confirmTermination(order);
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    return await alert.present();
  }

  async presentToast(_message: string, _header: string) {
    const toast = this.toastCtrl.create({
      message: _message,
      buttons: [
        {
          text: 'Close',
          role: 'close',
          handler: () => {
            this.presentLoader().then(() => {
              switch (this.type) {
                case 'pending':
                  this.getPendingOrders(1);

                  break;

                case 'active':
                  this.getActiveOrders(1);
                  break;

                case 'awaiting_install':
                  this.fetchAwaitingInstallation(1);
                  break;
              }
              this.loadingCtrl.dismiss();
            });
          },
        },
      ],
      position: 'middle',
    });
    return await (await toast).present();
  }

  segmentChanged(event: any) {
    this.presentLoader().then(() => {
      switch (event.detail.value) {
        case 'pending':
          this.type = event.detail.value;
          this.getPendingOrders(1).then(() => {
            this.loadingCtrl.dismiss();
          });

          break;

        case 'active':
          this.type = event.detail.value;
          this.getActiveOrders(1);
          this.loadingCtrl.dismiss();
          console.log('Test');

          break;

        case 'awaiting_install':
          this.type = event.detail.value;
          this.fetchAwaitingInstallation(1);

          this.loadingCtrl.dismiss();
      }
    });
  }

  editOrder(order: OrderStatus) {}
  setOpen(status: boolean) {
    this.openModal();
  }
  onWillDismiss(event: any) {}
  onSearchChange(event: any) {}
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
    });
    return await loader.present();
  }
  terminateOrder(order: OrderStatus) {
    this.presentAlert('Are you sure you want to terminate the order ?', order);
  }

  confirmTermination(order: OrderStatus) {
    this.presentLoader().then(() => {
      this.orderService.rejectOrder(order.order_number).subscribe({
        next: (response) => {
          if (response) {
            this.loadingCtrl.dismiss();
            this.presentToast(
              `Order ${order.order_number} has been terminated`,
              `${order.order_number} Termination`
            );
          }
        },
      });
    });
  }

  copy(order: string) {
    navigator.clipboard.writeText(order);
    this.presentCopyToast('Copied!');
  }
  async presentCopyToast(_message:string) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      duration:1500
    });
    return await toast.present();
  }
  fetchOrderTypes(orderType: number) {
    return ENUMS.GlobalEnums.fetchInstallTypes(orderType);
  }
  fetchISPs(ispID: number) {
    return ENUMS.GlobalEnums.fetchOrgNames(ispID);
  }
  fetchProductName(productID: number) {
    return ENUMS.GlobalEnums.fetchProductNames(productID);
  }
}
