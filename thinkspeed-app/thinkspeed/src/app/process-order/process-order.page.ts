import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderStatus } from './../interfaces/order-status';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-process-order',
  templateUrl: './process-order.page.html',
  styleUrls: ['./process-order.page.scss'],
})
export class ProcessOrderPage implements OnInit {
@Input() selectedOrder!: OrderStatus;
@Output() closeModal = new EventEmitter<boolean>();
orderForm! :FormGroup;

  constructor() { }

  ngOnInit() {
    this.prepForm();
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

  processOrder(){

  }
  cancel(){
    this.closeModal.emit(true);
  }

}
