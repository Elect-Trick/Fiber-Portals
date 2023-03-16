import { LoadingController, ToastController } from '@ionic/angular';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { SduLocation } from '../interfaces/sdu-location';
import { OrdersService } from '../services/orders.service';
import { MduLocation } from '../interfaces/mdu-location';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('search') searchField!: ElementRef;
  @ViewChild('map') map!: GoogleMap;
  @ViewChild('placesRef') placesRef!: GooglePlaceDirective;
  marker!: google.maps.Marker;

  type = '';
  noChecked = false;
  yesChecked = false;
  locationSelected = false;
  sduInstalled!: boolean;
  mduInstalled!: boolean;
  unitNumber = '';
  mduLocation: MduLocation = {
    unit_number: '',
    street_name: '',
    surburb: '',
    postal_code: 0,
    coordinates: '',
    network_id: '',
    is_Installed: false,
    creation_date: '',
    type: 'mdu',
    building_name: '',
  };
  sduLocation: SduLocation = {
    house_number: 0,
    street_name: '',
    surburb: '',
    postal_code: 0,
    coordinates: '',
    is_Installed: false,
    network_id: '',
    creation_date: '',
    type: 'sdu',
    isAdditional: false,
  };
  isAdditional = false;

  LatLngLit = {
    lat: -26.0475780802915,
    lng: 28.0582187697085,
  };

  elem!: any;
  formattedAddress: any;
  center = { lat: 50.064192, lng: -130.605469 };

  defaultBounds = {
    north: this.center.lat + 0.1,
    south: this.center.lat - 0.1,
    east: this.center.lng + 0.1,
    // west: this.center.lng - 0.1,
  };
  origin = [-26.0475780802915, 28.0582187697085];
  _options = {
    fields: ['address_components', 'geometry', 'icon', 'name'],
    strictBounds: false,
    bounds: [],

    types: ['places'],

    componentRestrictions: {
      country: ['ZAR'],
    },
  };
  mduForm: any;
  locationSub1: any;
  locationSub2: any;
  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private orderService: OrdersService,
    private el: ElementRef
  ) {
    this.mduForm = new FormGroup({
      is_installed: new FormControl('', [Validators.required]),
      unit_number: new FormControl('', [Validators.required]),
    });
  }
  ngOnDestroy(): void {
    if (this.locationSub1) {
      this.locationSub1.unsubscribe();
    }
    if (this.locationSub2) {
      this.locationSub2.unsubscribe();
    }
    this.clear();
  }
  ngAfterViewInit(): void {}
  nullChecker(event: any) {
    if (event.detail.value === '') {
      this.locationSelected = false;
    }
  }
  segmentChanged(event: any) {
    this.type = event.detail.value;
  }
  async presentLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Busy...',
    });

    return await loading.present();
  }
  processAddress(address: any, type: string) {
    switch (address.types[0]) {
      case 'premise':
        this.type = 'sdu';
        let arr = address.address_components;
        const sduComponents = arr.length - 1;
        this.sduLocation.postal_code = Number(
          `${arr[sduComponents].long_name}`
        );
        this.sduLocation.coordinates = `${address.geometry.location.lat()}, ${address.geometry.location.lng()}`;
        if(this.isAdditional){
          this.sduLocation.house_number =  this.sduLocation.house_number;

        }
        this.sduLocation.house_number = arr[0].long_name;
        this.sduLocation.street_name = `${arr[1].long_name}`;
        this.sduLocation.surburb = `${arr[2].long_name}`;

        break;

      default:
        this.type = 'mdu';
        let mduarr = address.address_components;
        const mduComponents = mduarr.length - 1;
        this.mduLocation.postal_code = Number(
          `${mduarr[mduComponents].long_name}`
        );
        this.mduLocation.coordinates = `${address.geometry.location.lat()}, ${address.geometry.location.lng()}`;
        this.mduLocation.street_name = `${mduarr[1].long_name}`;
        this.mduLocation.surburb = `${mduarr[2].long_name}`;
        // this.mduLocation.unit_number = mduarr[0].long_name;
        this.mduLocation.building_name = address.name;

        break;
    }
  }

  async presentMessageToast(_message: string, _cssClass: string) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      buttons: [
        {
          text: 'Close',
          role: 'ok',
          handler: () => {},
        },
      ],
      cssClass: _cssClass,
    });
    return await toast.present();
  }

  toggleAdditionalLine(event: any) {
    switch (event.detail.value) {
      case 'yes':
        this.isAdditional = true;

        break;
      case 'no':
        this.isAdditional = false;
        break;
    }
  }
  public handleAddressChange(address: any) {
    this.clear();

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.formattedAddress = address.formatted_address;
    this.LatLngLit = {
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng(),
    };
    this.processAddress(address, this.type);
    var latlng = new google.maps.LatLng(this.LatLngLit);
    this.marker = new google.maps.Marker({
      position: latlng,
      map: this.map.googleMap,
      title: 'Z1',
    });
    this.locationSelected = true;

    // Do some stuff
  }
  addLocation() {
    this.presentLoader().then(() => {
      switch (this.type) {
        case 'sdu':
          if (this.sduInstalled === undefined) {
            this.presentErrorToast('Missing Info, please complete the form');
          } else {
            this.sduLocation.is_Installed = this.sduInstalled;
            // API call goes here
            this.locationSub1 = this.orderService
              .addLocation(this.sduLocation)
              .subscribe({
                next: (response) => {
                  if (response) {
                    this.presentMessageToast(
                      'Success, the location has been added',
                      'success-toast'
                    );
                    this.clear();
                  } else {
                    console.log('Token has expired');
                  }
                },
                error: (error: any) => {
                  switch (error.status) {
                    case 400:
                      this.presentMessageToast(
                        'Oh No, something went wrong. Please contact support',
                        'success-toast'
                      );

                      break;

                    case 409:
                      this.presentMessageToast(
                        'The location already exists, try searching for it',
                        'success-toast'
                      );
                      this.clear();
                  }
                },
              });
          }

          break;

        default:
          if (this.mduInstalled === undefined || this.unitNumber === '') {
            this.presentErrorToast('Missing Info, please complete the form');
          } else {
            this.mduLocation.is_Installed = this.mduInstalled;
            this.mduLocation.unit_number = this.unitNumber;
            this.locationSub2 = this.orderService
              .addLocation(this.mduLocation)
              .subscribe({
                next: (response) => {
                  if (response) {
                    this.presentMessageToast(
                      'Success, the location has been added',
                      'success-toast'
                    );
                    this.clear();
                  } else {
                    console.log('Token has expired');
                  }
                },
                error: (error: any) => {
                  switch (error.status) {
                    case 400:
                      this.presentMessageToast(
                        'Oh No, something went wrong. Please contact support',
                        'success-toast'
                      );

                      break;

                    case 409:
                      this.presentMessageToast(
                        'The location already exists, try searching for it',
                        'success-toast'
                      );
                      this.clear();
                  }
                },
              });
          }
          break;
      }
      this.loadingCtrl.dismiss();
    });
  }
  async presentErrorToast(_message: string) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      buttons: [
        {
          text: 'Close',
          role: 'ok',
          handler: () => {},
        },
      ],
    });
    return await toast.present();
  }
  clear() {
    this.locationSelected = false;
    this.sduLocation = {
      house_number: 0,
      street_name: '',
      surburb: '',
      postal_code: 0,
      coordinates: '',
      is_Installed: false,
      creation_date: '',
      network_id: '',
      type: 'sdu',
    };
    this.mduLocation = {
      unit_number: '',
      street_name: '',
      surburb: '',
      postal_code: 0,
      coordinates: '',
      network_id: '',
      is_Installed: false,
      creation_date: '',
      type: 'mdu',
      building_name: '',
    };
    this.isAdditional = false;
  }

  ngOnInit() {
    this.presentLoader().then(() => {
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      }, 250);
    });
  }

  prepareMap() {
    const center = { lat: 50.064192, lng: -130.605469 };
    const defaultBounds = {
      north: center.lat + 0.1,
      south: center.lat - 0.1,
      east: center.lng + 0.1,
      west: center.lng - 0.1,
    };

    const options = {
      bounds: defaultBounds,
      fields: ['address_components', 'geometry', 'icon', 'name'],
      strictBounds: false,
      types: ['places'],
    };
  }

  toggleInstalled(event: any) {
    switch (this.type) {
      case 'sdu':
        switch (event.detail.value) {
          case 'yes':
            this.sduInstalled = true;

            break;
          default:
            this.sduInstalled = false;
            break;
        }

        break;

      default:
        switch (event.detail.value) {
          case 'yes':
            this.mduInstalled = true;

            break;
          default:
            this.mduInstalled = false;
            break;
        }
        break;
    }
  }
}
