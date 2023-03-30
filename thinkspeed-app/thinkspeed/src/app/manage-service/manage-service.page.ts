import { ManageFaultsService } from './../services/manage-faults.service';
import { ServiceHistory } from './../interfaces/service-history';
import {
  AlertController,
  ToastController,
  LoadingController,
  InfiniteScrollCustomEvent,
} from '@ionic/angular';
import { Products } from './../interfaces/products';
import { ENUMS } from './../Helpers/globalEnums';
import { OrdersService } from './../services/orders.service';
import { HttpResponse } from '@capacitor/core';
import { ManageServicesService } from './../services/manage-services.service';
import { ServiceSearch } from './../interfaces/service-search';
import { LocationSearch } from './../interfaces/location-search';
import { Location } from './../interfaces/location';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Service } from '../interfaces/service';
import { Regrade } from '../interfaces/regrade';
import { Router } from '@angular/router';
import { Ticket } from '../interfaces/ticket';
import { exit } from 'process';
import { FaultType } from '../interfaces/fault-type';

@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-service.page.html',
  styleUrls: ['./manage-service.page.scss'],
})
export class ManageServicePage implements OnInit, OnDestroy {
  type = 'location';
  searchData: LocationSearch = {
    type: '',
    searchString: '',
  };
  regradeRequest: Regrade = {
    product_id: 0,
    ext_reference: '',
    service_id: 0,
    location_type: '',
    order_status: 0,
    order_type: 0,
    date: '',
    order_number: '',
  };

  history: Regrade[] = [];
  serviceHistory: ServiceHistory = {
    location_type: '',
    location_id: 0,
    service_id: 0,
  };
  alternativeContact = false;
  speedProfile = {
    download: '',
    upload: '',
  };

  faultTypes: FaultType[] = [];
  ticket: Ticket = {
    ticket_id: 0,
    ticket_reference: '',
    ticket_status: 0,
    location_id: 0,
    location_type: '',
    service_id: 0,
    fault_id: 0,
    fault_description: '',
    comments: '',
    client_name: '',
    client_surname: '',
    client_contact_number: '',
    client_email: '',
    creation_date: '',
    network_id: '',
    alternative_contact_name: '',
    alternative_number: '',
    last_updated: '',
    organization_id:0,
    technician:''
  };
  tickets: Ticket[] = [];
  products: Products[] = [];
  found = false;
  locations: Location[] = [];
  selectedService: Service = {
    service_id: 0,
    location_id: 0,
    product_id: 0,
    organization_id: 0,
    isp_order_number: '',
    network_id: '',
    isp_modem_mac: '',
    service_status: 0,
    last_updated: '',
    valn: '',
    order_type: 0,
    location_string: '',
    client_name: '',
    client_surname: '',
    client_email: '',
    client_contact_number: '',
    order_number: '',
  };
  selectedLocation: Location = {
    location_id: 0,
    location_string: '',
  };
  isSelected = false;
  serviceObject: ServiceSearch = {
    searchString: '',
    searchType: 0,
    locationType: '',
  };
  isFSAN = false;
  isChecked!: boolean;
  locationSub: any;
  serviceSub: any;
  services: Service[] = [];
  isModalOpen = false;
  orderSub: any;
  prodSub: any;
  ticketModallOpen = false;
  serviceSub2: any;
  historySub: any;
  regradeSub: any;
  regradeSub2: any;
  ticketSub: any;

  constructor(
    private service: ManageServicesService,
    private orderService: OrdersService,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private ticketService: ManageFaultsService
  ) {}
  ngOnDestroy() {
    this.ticketModallOpen = false;

    this.cleanUp();
  }

  ngOnInit() {
    this.presentLoader().then(() => {
      this.serviceObject.searchType = 1;
      this.serviceObject.locationType = 'sdu';
      this.loadingCtrl.dismiss();
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  setTicketModal(isOpen: boolean) {
    this.ticketModallOpen = isOpen;
    this.alternativeContact = false;
    this.ticket = {
      ticket_id: 0,
      ticket_reference: '',
      ticket_status: 0,
      location_id: 0,
      location_type: '',
      service_id: 0,
      fault_id: 0,
      fault_description: '',
      comments: '',
      client_name: '',
      client_surname: '',
      client_contact_number: '',
      client_email: '',
      creation_date: '',
      network_id: '',
      alternative_contact_name: '',
      alternative_number: '',
      last_updated: '',
      organization_id:0,
      technician:''
    };

    if (this.faultTypes.length == 0) {
      this.fetchFaultTypes();
    }
  }
  toggleLocationType(event: any) {
    this.serviceObject.locationType = event.detail.value;
    this.serviceObject.searchType == 1 ? 2 : 1;
    this.isChecked = false;
    this.clearSearch(event);
    this.clearData();
  }

  search(event: any) {
    if (event.detail.value != '') {
      switch (this.serviceObject.searchType) {
        case 1:
          this.searchData.searchString = event.detail.value;
          this.searchData.type = this.serviceObject.locationType;
          this.orderSub = this.orderService
            .findLocation(this.searchData)
            .subscribe({
              next: (data) => {
                this.locations = data;
                this.found = true;
              },
              error: (error: HttpResponse) => {},
            });

          break;

        case 2:
          if (event.detail.value) {
            this.serviceObject.searchString = event.detail.value;
            this.locationSub = this.service
              .findService(this.serviceObject)
              .subscribe({
                next: (data) => {
                  if (data) {
                    this.services = data;
                    this.selectedService = this.services[0];

                    this.found = true;
                  }
                },
                error: (error: HttpResponse) => {},
              });
          }
          break;
      }
    }else{
      this.presentLoader().then(() => {
        this.clearSearch(event);
        this.clearData();
        this.loadingCtrl.dismiss();
      });
    }

  }
  clearSearch(event: any) {
    this.locations = [];
    this.selectedLocation = {
      location_id: 0,
      location_string: '',
    };
    this.found = false;
    this.isSelected = false;
    this.isFSAN = false;
  }
  confirmService(location: Location) {
    this.presentLoader().then(() => {
      this.isSelected = true;
      this.selectedLocation = location;

      this.found = false;
      //Searching for a service using the location_id, i need to add a check for fsan check
      this.serviceObject.searchString = this.selectedLocation.location_id.toString();
      this.serviceSub2 = this.service
        .findService(this.serviceObject)
        .subscribe({
          next: (data) => {
            if (data) {
              this.services = data;
              this.selectedService = this.services[0];
              this.getserviceHistory();
              this.fetchSpeedProfiles(this.selectedService.product_id);
            }
            return this.selectedService;
          },
          error: (error: HttpResponse) => {},
        });
      this.fetchProducts();
      this.loadingCtrl.dismiss();
    });
  }
  clearData() {
    this.selectedService = {
      service_id: 0,
      location_id: 0,
      product_id: 0,
      organization_id: 0,
      isp_order_number: '',
      network_id: '',
      isp_modem_mac: '',
      service_status: 0,
      last_updated: '',
      valn: '',
      order_type: 0,
      location_string: '',
      client_name: '',
      client_surname: '',
      client_email: '',
      client_contact_number: '',
      order_number: '',
    };
    this.services = [];
  }
  clearRegrade() {
    this.regradeRequest = {
      product_id: 0,
      ext_reference: '',
      service_id: 0,
      location_type: '',
      order_status: 0,
      order_type: 0,
      date: '',
      order_number: '',
    };
  }
  activateSegment(event: any) {
    this.isChecked = false;
    this.locations = [];
    this.clearData();
    switch (event.detail.value) {
      case 'location':
        this.isFSAN = false;
        break;

      default:
        this.isFSAN = true;
        break;
    }
    switch (event.detail.value) {
      case 'location':
        this.serviceObject.searchType = 1;
        break;

      case 'mdu':
        this.serviceObject.searchType = 2;
        break;
    }
    this.clearSearch(event);
  }
  viewService(service: Service) {
    this.presentLoader().then(()=>{
      this.found = false;
      this.isSelected = true;
      this.selectedService = service;
      this.isFSAN = true;
      this.loadingCtrl.dismiss();

    });

  }

  fetchProducts() {
    this.prodSub = this.orderService.fetchProducts().subscribe({
      next: (data) => {
        this.products = data.filter(
          (z) => Number(z.product_id) != this.selectedService.product_id
        );
        // this.products = data;
      },
    });
  }
  onIonInfinite(ev: any) {
    this.getserviceHistory();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  async presentRegradeToast(_message: string, _duration?: number) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      duration: _duration,
      buttons: [
        {
          text: 'Copy and Close',
          role: 'ok',
          handler: () => {
            this.copy(this.regradeRequest.order_number);
          },
        },
      ],
    });
    return await toast.present();
  }
  async presentTicketToast(
    _message: string,
    _data?: string,
    _duration?: number
  ) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      duration: _duration,
      buttons: [
        {
          text: 'Copy and Close',
          role: 'ok',
          handler: () => {
            this.copy(_data);
          },
        },
      ],
    });
    return await toast.present();
  }
  async presentLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Busy...',
    });

    return await loading.present().then(() => {
      this.loadingCtrl.dismiss();
    });
  }

  async presentAlert(item: Regrade) {
    const alert = await this.alertController.create({
      header: 'Cancel Regrade',
      message: 'Do you want to proceed? This cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return;
          },
        },
        {
          text: 'Proceed',
          role: 'confirm',
          handler: () => {
            this.presentLoader().then(() => {
              this.cancelRegrade(item);
              this.loadingCtrl.dismiss();
            });
          },
        },
      ],
    });

    await alert.present();
  }
  copy(text?: any) {
    navigator.clipboard.writeText(text);
    this.toastCtrl.dismiss();
  }
  async getserviceHistory() {
    this.serviceHistory.location_id = this.selectedService.location_id;
    this.serviceHistory.service_id = this.selectedService.service_id;
    this.serviceHistory.location_type = this.serviceObject
      .locationType as string;
    this.historySub = this.service
      .fetchServiceHistory(this.serviceHistory)
      .subscribe({
        next: (data) => {
          this.history = data;
        },
      });
  }
  regrade() {
    this.regradeRequest.location_type = this.serviceObject
      .locationType as string;
    this.regradeRequest.order_status = 1;
    this.regradeRequest.order_type = 1;
    this.regradeRequest.service_id = this.selectedService.service_id;

    if (
      this.regradeRequest.ext_reference != '' &&
      this.regradeRequest.product_id != 0
    ) {
      this.regradeSub = this.service.regrade(this.regradeRequest).subscribe({
        next: (data) => {
          if (data) {
            this.presentRegradeToast(
              `Success, your order was submitted, ${data}`
            );
            this.isModalOpen = false;
            this.getserviceHistory();
          } else {
            this.presentRegradeToast('Your session has expired');
          }
        },
        error: (error: any) => {
          switch (error.status) {
            case 409:
              this.regradeRequest = error.error;
              this.presentRegradeToast(
                `An Existing order has been found, ${this.regradeRequest.order_number}`
              );
              this.isModalOpen = false;
              break;

            default:
              break;
          }
        },
      });
      this.clearRegrade();
    }
  }

  async cancelRegrade(regrade: Regrade) {
    regrade.order_status = 3;
    this.regradeSub2 = this.service.cancelRegrade(regrade).subscribe({
      next: (data) => {
        if (!data) {
          this.presentRegradeToast('Your session has expired');
        }
      },
    });
  }

  fetchFaultTypes() {
    this.ticketService.fetchFaultTypes().subscribe({
      next: (data) => {
        if (data) {
          this.faultTypes = data;
        }
      },
      error: (error: HttpResponse) => {},
    });
  }

  logTicket() {
    this.ticket.ticket_status = 1;
    this.ticket.location_id = this.selectedService.location_id;
    this.ticket.location_type = this.serviceObject.locationType as string;
    this.ticket.service_id = this.selectedService.service_id;
    this.ticket.client_name = this.selectedService.client_name;
    this.ticket.client_surname = this.selectedService.client_surname;
    this.ticket.organization_id = this.selectedService.organization_id;
    this.ticket.client_contact_number =
      this.selectedService.client_contact_number;
    this.ticket.client_email = this.selectedService.client_email;
    this.ticket.network_id = this.selectedService.network_id;

    this.ticketSub = this.ticketService.logTicket(this.ticket).subscribe({
      next: (response) => {
        if (response) {
          this.presentTicketToast(
            `Success! A support ticket has been logged with ${response}`,
            response
          );
          this.ticketModallOpen = false;
        } else {
          this.presentTicketToast(`Session Expired! Please log back in`);

          // log them out
        }
      },
      error: (error: any) => {
        switch (error.status) {
          case 400:
            this.presentTicketToast(
              'Failed, Something went wrong. Contact Support'
            );
            this.ticketModallOpen = false;
            break;

          case 409:
            this.presentTicketToast(
              `Failed, Existing Ticket found ->  ${error.error}`,
              error.error
            );
            this.ticketModallOpen = false;
            break;
        }
      },
    });
  }
  toggleAltContact() {
    if (!this.alternativeContact) {
      this.alternativeContact = true;
      return this.alternativeContact;
    } else {
      this.alternativeContact = false;
      return this.alternativeContact;
    }
  }
  fectchServiceStatus(statusID: number) {
    return ENUMS.GlobalEnums.fetchServiceStatusNames(statusID);
  }
  fectchSISPName(ispID: number) {
    return ENUMS.GlobalEnums.fetchOrgNames(ispID);
  }
  fetchOrderTypes(orderID: number) {
    return ENUMS.GlobalEnums.fetchInstallTypes(orderID);
  }
  fetchISPImages(ispID: number) {
    return ENUMS.GlobalEnums.fetchISPImages(ispID);
  }
  fetchSpeedProfiles(productID: number) {
    // Too lazy to do regex string match
    let speed = ENUMS.GlobalEnums.fetchProductNames(productID).toString();
    speed = speed.replace('FTTH- ', '');
    speed = speed.replace('Mbps', '');
    let downLoad = speed.split('/');
    this.speedProfile.download = downLoad[0];
    this.speedProfile.upload = downLoad[1];
  }
  fetchServiceChangeNames(serviceID: number) {
    return ENUMS.GlobalEnums.fetchServiceChangeNames(serviceID);
  }
  fetchRegradeStatus(statusID: number) {
    return ENUMS.GlobalEnums.fetchRegradeStatus(statusID);
  }

  cleanUp() {
    this.searchData = {
      searchString: '',
      type: '',
    };
    this.regradeRequest = {
      product_id: 0,
      ext_reference: '',
      service_id: 0,
      location_type: '',
      order_status: 0,
      order_type: 0,
      date: '',
      order_number: '',
    };
    this.serviceHistory = { location_type: '', location_id: 0, service_id: 0 };
    this.speedProfile = { download: '', upload: '' };
    this.selectedService = {
      service_id: 0,
      location_id: 0,
      product_id: 0,
      organization_id: 0,
      isp_order_number: '',
      network_id: '',
      isp_modem_mac: '',
      service_status: 0,
      last_updated: '',
      valn: '',
      order_type: 0,
      location_string: '',
      client_name: '',
      client_surname: '',
      client_email: '',
      client_contact_number: '',
      order_number: '',
    };
    this.ticket = {
      ticket_id: 0,
      ticket_reference: '',
      ticket_status: 0,
      location_id: 0,
      location_type: '',
      service_id: 0,
      fault_id: 0,
      fault_description: '',
      comments: '',
      client_name: '',
      client_surname: '',
      client_contact_number: '',
      client_email: '',
      creation_date: '',
      network_id: '',
      alternative_contact_name: '',
      alternative_number: '',
      last_updated: '',
      organization_id:0,
      technician:''
    };
    this.selectedLocation = { location_id: 0, location_string: '' };
    this.serviceObject = { searchString: '', searchType: 0, locationType: '' };
    this.history = [];
    this.products = [];
    this.services = [];
    this.locations = [];
    this.tickets = [];
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
    if (this.prodSub) {
      this.prodSub.unsubscribe();
    }
    if (this.serviceSub2) {
      this.serviceSub2.unsubscribe();
    }
    if (this.historySub) {
      this.historySub.unsubscribe();
    }
    if (this.regradeSub) {
      this.regradeSub.unsubscribe();
    }
    if (this.regradeSub2) {
      this.regradeSub2.unsubscribe();
    }
    if (this.ticketSub) {
      this.ticketSub.unsubscribe();
    }

    this.clearData();
    this.clearRegrade();
  }
}
// Get the location ID, use that to searh the services table based on the id.
