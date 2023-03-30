import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { OrderStatus } from '../interfaces/order-status';
import { OrdersService } from '../services/orders.service';
import { Location } from '../interfaces/location';
import { HttpErrorResponse } from '@angular/common/http';
import { ENUMS } from '../Helpers/globalEnums';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit,OnDestroy {
  @Input() order!: OrderStatus;
  location: Location = {
    location_id: 0,
    location_string: '',
  };
  location_string = '';
  message!: string;
  name!: string;
  locationSub!: Subscription;

  constructor(private orderService: OrdersService) {}
  ngOnDestroy(): void {
    this.location = {
      location_id: 0,
      location_string: '',
    };
    if(this.locationSub){
      this.locationSub.unsubscribe();
    }

  }

  ngOnInit() {
    this.prepareLocationObject();
  }

  cancel() {
    // this.modal.dismiss(null, 'cancel');
  }
  prepareLocationObject() {
    this.location.location_id = this.order.location_id;
    this.location.location_string = this.order.location_type;
   this.locationSub = this.orderService.findLocationwithID(this.location).subscribe({
      next: (data) => {
        console.log(data);
        this.location_string = data;
      },
      error: (error: HttpErrorResponse) => {
        switch (error.status) {
          case 200:
            console.log(error);
            this.location_string = error.error.text;
            break;

          default:
            break;
        }
      },
    });
  }

  confirm() {
    console.log(this.order);
    // this.modal.dismiss(this.name, 'confirm');
  }
  viewService(service: string) {}
  fetchOrgNames(organization: number) {
    return ENUMS.GlobalEnums.fetchOrgNames(organization);
  }
  fetchProductNames(product: number) {
    return ENUMS.GlobalEnums.fetchProductNames(product);
  }
  fetchInstallTypes(installType: number) {
    return ENUMS.GlobalEnums.fetchInstallTypes(installType);
  }
  fetchISPImages(isp: number) {
    return ENUMS.GlobalEnums.fetchISPImages(isp);
  }
}


