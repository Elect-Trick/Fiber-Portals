import { OrdersService } from './../services/orders.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderStatus } from '../interfaces/order-status';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.page.html',
  styleUrls: ['./edit-order.page.scss'],
})
export class EditOrderPage implements OnInit {
  @Input() selectedOrder!: OrderStatus;
  @Output() closeModal = new EventEmitter<boolean>();
  orderForm!: FormGroup;
  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private orderService: OrdersService, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.prepForm();
  }

  updateOrder() {
    this.presentLoader().then(()=>{
      if (this.orderForm.valid) {

        this.prepData();
        // Submit to API

        this.orderService.updateOrder(this.selectedOrder).subscribe({next:(response)=>{
          if(response){
            this.loadingCtrl.dismiss();
            this.closeModal.emit(true);
            this.presentToast(`Order ${this.selectedOrder.order_number} has been Updated Successfully`);
          }
        }});




      }

    });

    console.log(this.selectedOrder);
  }

  async presentToast(_message: string, _duration?: number) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      duration: _duration,
      buttons: [
        {
          text: 'Close',
          role: 'ok',
          handler: () => {

          },
        },
      ],
    });
    return await toast.present();
  }

  prepData(){
    this.selectedOrder.client_name =
    this.orderForm.controls['client_name'].value;
  this.selectedOrder.client_surname =
    this.orderForm.controls['client_surname'].value;
  this.selectedOrder.contact_number =
    this.orderForm.controls['contact_number'].value;
  this.selectedOrder.client_email =
    this.orderForm.controls['client_email'].value;

  }
  cancel() {
    if (this.orderForm.dirty) {
      this.presentAlert('Are you sure you want to leave before saving?');
    } else {
      this.closeModal.emit(true);
    }
  }
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
    });
    return await loader.present();
  }
  async presentAlert(_message: string) {
    const alert = await this.alertCtrl.create({
      message: _message,
      header: 'Cancel Editing',

      buttons: [
        {
          role: 'ok',
          text: 'Confirm',
          handler: () => {
            this.closeModal.emit(true);
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    return await alert.present();
  }

  prepForm() {
    this.orderForm = new FormGroup({
      client_name: new FormControl('', [Validators.required]),
      client_surname: new FormControl('', [Validators.required]),
      contact_number: new FormControl('', [Validators.required]),
      client_email: new FormControl('', [Validators.required]),
    });

    this.orderForm.controls['client_name'].setValue(
      this.selectedOrder.client_name
    );
    this.orderForm.controls['client_surname'].setValue(
      this.selectedOrder.client_surname
    );
    this.orderForm.controls['contact_number'].setValue(
      this.selectedOrder.contact_number
    );
    this.orderForm.controls['client_email'].setValue(
      this.selectedOrder.client_email
    );
  }
}
