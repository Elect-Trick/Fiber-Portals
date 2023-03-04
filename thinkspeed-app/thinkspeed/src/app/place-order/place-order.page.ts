import { HttpResponse } from '@capacitor/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable, ReplaySubject } from 'rxjs';
import { OrdersService } from './../services/orders.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { LocationSearch } from '../interfaces/location-search';
import { Location } from '../interfaces/location';
import {
  IonAccordionGroup,
  IonSearchbar,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Products } from '../interfaces/products';
import { NewOrder } from '../interfaces/new-order';
import { HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmailValidator } from '../Validators/emailValidatorcopy';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.page.html',
  styleUrls: ['./place-order.page.scss'],
})
export class PlaceOrderPage implements OnInit, OnDestroy {
  found = false;
  isArray = new ReplaySubject<boolean>(1);
  locations: Array<Location> = [];
  selectedLocation: Location = {
    location_id: '',
    location_string: '',
  };
  locationSub!: Subscription;
  isSelected = false;
  searching!: boolean;
  searchData: LocationSearch = {
    type: '',
    searchString: '',
  };
  type = 'sdu';
  isModalOpen = false;
  @ViewChild('searcher', { static: true }) seacher!: IonSearchbar;
  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;
  newOrder!: FormGroup;
  products: Products[] = [];
  order!: NewOrder;
  order_number!: string;

  productSub!: Subscription;
  orderSub!: Subscription;

  constructor(
    private orderService: OrdersService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.prepareForm();
  }
  ngOnDestroy(): void {
    this.searchData = {
      type: '',
      searchString: '',
    };
    this.products =[];
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
    if (this.productSub) {
      this.productSub.unsubscribe();
    }

    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.presentLoader().then(()=>{
      this.openAccordion();
      this.productSub = this.orderService.fetchProducts().subscribe({
        next: (data) => {
          this.products = data;
        },
        error: (error: HttpResponse) => {},
      });
      this.loadingCtrl.dismiss();


    });

  }
  placeOrder() {
    if (this.newOrder.valid) {
      this.presentLoader().then(()=>{
        this.order = this.newOrder.value;
        this.order.location_type = this.type;
        this.order.location_id = parseInt(this.selectedLocation.location_id);
        this.orderSub = this.orderService.placeOrder(this.order).subscribe({
          next: (data: any) => {
            this.loadingCtrl.dismiss();
            if (!data) {
              this.presentToast('Your token has expired, please log back in');
              this.newOrder.reset();
              this.router.navigateByUrl('');
            }
          },
          error: (error: any) => {
            this.loadingCtrl.dismiss();
            switch (error.status) {
              case 200:
                this.order_number = error.error.text;
                this.presentToast(
                  '<h1>Success</h1> ' +
                    '<h2>' +
                    error.error.text +
                    '<h2/>' +
                    ' is your Order number'
                );

                break;
              case 400:
                this.order_number = error.error;
                this.presentToast(
                  '<h1>Existing Order</h1> ' +
                    '<h2>' +
                    error.error +
                    '<h2/>' +
                    ' exists at location'
                );

                break;

              case 408:
                this.presentToast('Something went wrong, contact support');
                break;
            }
            this.reset();
          },
        });

      });

    }
  }
  reset() {
    this.newOrder.reset();
    this.selectedLocation = {
      location_id: '',
      location_string: '',
    };
    this.openAccordion();
    this.isSelected = !this.isSelected;
    this.searchData = {
      searchString: '',
      type: '',
    };
  }
  copy(text?: any) {
    navigator.clipboard.writeText(text);
    this.toastCtrl.dismiss();
  }

  prepareForm() {
    this.newOrder = new FormGroup(
      {
        client_name: new FormControl('', [Validators.required]),
        client_surname: new FormControl('', [Validators.required]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
        confirm_email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
        contact_number: new FormControl('', [
          Validators.required,
          Validators.maxLength(10),
        ]),
        id_number: new FormControl('', [Validators.required]),
        product: new FormControl('', [Validators.required]),
        isp_reference: new FormControl('', [Validators.required]),
        order_type: new FormControl('', [Validators.required]),
        network_id: new FormControl('', []),
      },
      EmailValidator.emailMatchingValidatior
    );
    return this.newOrder;
  }
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy...',
    });
    return await loader.present();
  }

  async presentToast(_message: string, _duration?: number) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      duration: _duration,
      buttons: [
        {
          text: 'Copy and Close',
          role: 'ok',
          handler: () => {
            this.copy(this.order_number);
          },
        },
      ],
    });
    return await toast.present();
  }
  toggleAccordion() {
    const timeoutId = setTimeout(() => {
      const nativeEl = this.accordionGroup;
      switch (nativeEl.value) {
        case 'first':
          nativeEl.value = 'second';
          break;

        default:
          break;
      }
    }, 500);
  }
  openAccordion() {
    const nativeEl = this.accordionGroup;
    nativeEl.value = 'first';
  }
  activateSegment(event: any) {
    this.clearSearch(event);
  }

  search(event: any) {
    if (event.detail.value) {
      this.searchData.type = this.type;
      this.searchData.searchString = event.detail.value;
      this.locationSub = this.orderService
        .findLocation(this.searchData)
        .subscribe({
          next: (data) => {
            this.searching = true;
            if (data) {
              this.locations = data;
              this.found = true;
              this.searching = false;
            } else {
              this.found = false;
              this.presentToast(
                'Your token has expired, please log back in',
                2000
              );
              this.router.navigateByUrl('');
            }
          },
          error: (error: HttpResponse) => {
            switch (error.status) {
              case 400:
                this.presentToast(
                  'Something went wrong, contact support',
                  2000
                );
                break;

              default:
                break;
            }
          },
        });
    } else {
      this.clearSearch(event);
    }
  }

  clearSearch(event: any) {
    this.locations = [];
    this.found = false;
    this.isSelected = false;

    this.selectedLocation = {
      location_id: '',
      location_string: '',
    };
    //this.isArray.next(false);
  }
  confirmLocation(location: Location) {
    //  this.presentLoader();

    this.isSelected = true;
    this.selectedLocation = location;
    this.locations = [];
    this.found = false;
    this.toggleAccordion();
  }

  async foundStatus() {
    return this.found ? true : false;
  }
}

