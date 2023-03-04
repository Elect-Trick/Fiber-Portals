import { Subscription } from 'rxjs';
import { CompleteTicket } from './../interfaces/complete-ticket';
import { ManageFaultsService } from './../services/manage-faults.service';
import { OrdersService } from './../services/orders.service';
import { LocationSearch } from './../interfaces/location-search';
import { Location } from './../interfaces/location';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ticket } from '../interfaces/ticket';
import { TicketSearch } from '../interfaces/ticket-search';
import {
  InfiniteScrollCustomEvent,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { ENUMS } from '../Helpers/globalEnums';
import { Comment } from '../interfaces/comment';
import { async, tick } from '@angular/core/testing';
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  type = 'location';
  ticketSegmentType = 'review';
  isSelected = false;
  fsanTickets: CompleteTicket[] = [];
  selectedLocation: Location = {
    location_id: '',
    location_string: '',
  };
  comments: Comment[] = [];
  comment: Comment = {
    comment_id: 0,
    ticket_id: 0,
    service_id: 0,
    replier_email: '',
    comment: '',
    location_id: 0,
    reply_date: '',
    location_type: '',
  };
  searchObject: LocationSearch = {
    type: 'sdu',
    searchString: '',
  };
  selectedTicket: Ticket = {
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
  isDisputable = false;
  isDisputed = false;
  found = false;
  locations: Location[] = [];

  isChecked = false;
  isFSAN = false;
  ticketObject: TicketSearch = {
    searchString: '',
    searchType: 0,
  };
  ticketsFound!: boolean;
  myClass: string = '';
  ticketSub!: Subscription;
  locationSub!: Subscription;
  ticketSub2!: Subscription;
  locationSub2!: Subscription;
  resolveSub!: Subscription;
  commentSub!: Subscription;
  ticketSub3!: Subscription;

  viewTicket(ticket: Ticket) {
    this.presentLoader().then(() => {
      this.selectedTicket = ticket;
      this.fetchComments(this.selectedTicket);
      this.found = false;
      if (
        this.selectedTicket.ticket_status == 3 ||
        this.selectedTicket.ticket_status == 4
      ) {
        this.isDisputable = true;
      } else {
        this.isDisputable = false;
      }
      this.loadingCtrl.dismiss();
    });
  }

  async presentLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Busy...',
    });

    return await loading.present();
  }

  confirmLocation(location: Location) {
    this.selectedLocation = location;
    this.selectedLocation.location_type = this.searchObject.type;
    this.found = false;

    this.presentLoader().then(() => {
      this.fetchLocationTickets(this.selectedLocation).then(() => {
        this.loadingCtrl.dismiss();
      });
    });
    // Search for tickets based on location criteria , this is gonna be fun
  }

  clearSearch($event: Event) {
    this.clearData();
  }

  async fetchLocationTickets(location: Location) {
    this.locationSub = this.ticketService
      .getLocationTickets(location)
      .subscribe({
        next: (data) => {
          if (data) {
            this.tickets = data;

            this.selectedTicket = this.tickets[0];
            this.fetchComments(this.selectedTicket);
            if (
              this.selectedTicket.ticket_status == 3 ||
              this.selectedTicket.ticket_status == 4
            ) {
              this.isDisputable = true;
            }
            this.ticketsFound = true;
          }
        },
      });
    return true;
  }

  async fetchTicketbyID(ticket: LocationSearch) {
    this.ticketSub2 = this.ticketService
      .fetchTicketbyID(this.searchObject)
      .subscribe({
        next: (data) => {
          if (data) {
            this.tickets = data.ticket;
            this.selectedLocation.location_string = data.location_string;
            this.found = true;
          }
        },
      });
  }
  search(event: any) {
    if (event.detail.value != '') {
      this.searchObject.searchString = event.detail.value;
      switch (this.type) {
        case 'location':
          this.locationSub2 = this.orderService
            .findLocation(this.searchObject)
            .subscribe({
              next: (data) => {
                if (data) {
                  this.locations = data;
                  this.found = true;
                }
              },
            });

          break;

        case 'ticket_id':
          this.searchObject.searchString = event.detail.value;
          this.searchObject.type = this.type;
          this.fetchTicketbyID(this.searchObject);

          break;
      }
    } else {
      this.presentLoader().then(() => {
        this.locations = [];
        this.tickets = [];
        this.selectedLocation = {
          location_id: '',
          location_string: '',
          location_type: '',
        };
        this.selectedTicket = {
          ticket_id:0,
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
          last_updated: '', organization_id:0,
          technician:''
        };
        this.loadingCtrl.dismiss();
      });
    }
    // Search for location, set it to selectedLocation
  }
  activateSegment(event: any) {
    this.clearData();
    switch (event.detail.value) {
      case 'location':
        this.isFSAN = false;
        this.ticketObject.searchType = 1;

        break;

      default:
        this.isFSAN = true;
        this.ticketObject.searchType = 2;

        break;
    }
  }

  dispute() {
    this.isDisputed = true;
  }
  async acceptResolution(ticket: Ticket) {
    this.presentLoader().then(() => {
      this.resolveSub = this.ticketService.acceptResolution(ticket).subscribe({
        next: (data) => {
          if (data) {
            this.fetchLocationTickets(this.selectedLocation).then(() => {
              this.isDisputed = false;
              this.isDisputable = false;

              this.loadingCtrl.dismiss();
            });
          }
        },
      });
    });
  }
  logDispute() {
    this.isDisputed = false;
    this.comment.ticket_id = this.selectedTicket.ticket_id;
    this.comment.service_id = this.selectedTicket.service_id;
    this.comment.location_id = this.selectedTicket.location_id;
    this.comment.location_type = this.selectedTicket.location_type;
    let token = localStorage.getItem('token');
    if (token) {
      let userItem = JSON.parse(atob(token.split('.')[1]));
      this.comment.replier_email = userItem.username;
    }
    this.presentLoader().then(() => {
      this.commentSub = this.ticketService.postComment(this.comment).subscribe({
        next: (response) => {
          if (response) {
            switch (this.type) {
              case 'location':
                this.fetchLocationTickets(this.selectedLocation).then(() => {
                  this.loadingCtrl.dismiss();
                });

                break;

              default:
                this.fetchTicketbyID(this.searchObject).then(() => {
                  this.fetchComments(this.selectedTicket).then(() => {
                    this.loadingCtrl.dismiss();
                  });
                });
                break;
            }
          }
        },
      });
    });
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
          handler: () => {},
        },
      ],
    });
    return await toast.present();
  }
  async clearData() {
    this.isChecked = false;
    this.tickets = [];
    this.locations =[];
    this.isDisputable = false;
    this.isDisputed = false;
    this.found = false;
    this.isSelected = false;
    this.selectedTicket = {
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
    this.selectedLocation = { location_id: '', location_string: '' };
    this.searchObject = { type: 'sdu', searchString: '' };
  }
  toggleLocationType(event: any) {
    this.clearData();
    this.searchObject.type = event.detail.value;
  }

  constructor(
    private orderService: OrdersService,
    private loadingCtrl: LoadingController,
    private ticketService: ManageFaultsService,
    private toastCtrl: ToastController
  ) {}
  ngOnDestroy(): void {
    this.clearData();

    if (this.ticketSub) {
      this.ticketSub.unsubscribe();
    }
    if (this.ticketSub2) {
      this.ticketSub2.unsubscribe();
    }
    if (this.ticketSub3) {
      this.ticketSub3.unsubscribe();
    }
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
    if (this.locationSub2) {
      this.locationSub2.unsubscribe();
    }
    if (this.resolveSub) {
      this.resolveSub.unsubscribe();
    }
    if (this.commentSub) {
      this.commentSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.presentLoader().then(() => {
      this.loadingCtrl.dismiss();
    });
  }

  async fetchComments(ticket: Ticket) {
    this.ticketSub = this.ticketService.fetchComments(ticket).subscribe({
      next: (data) => {
        if (data) {
          this.comments = data;
        }
      },
    });
  }

  selectTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.myClass = this.getClass(this.selectedTicket) as string;
    this.presentLoader().then(() => {
      if (
        this.selectedTicket.ticket_status == 3 ||
        this.selectedTicket.ticket_status == 4
      ) {
        this.isDisputable = true;
      } else {
        this.isDisputable = false;
        this.isDisputed = false;
      }
      this.fetchComments(this.selectedTicket).then(() => {
        this.loadingCtrl.dismiss();
      });
    });
  }
  ticketSegment(event: any) {
    this.ticketSegmentType = event.detail.value;
  }

  getClass(ticket: Ticket) {
    let myClass;
    switch (ticket.ticket_status) {
      case 1:
        myClass = 'ticket-indicator-open';
        break;

      case 2:
        myClass = 'ticket-indicator-open';

        break;
      case 3:
        myClass = 'ticket-indicator-isp-confirm';
        break;
      case 4:
        myClass = 'ticket-indicator-isp-disputed';
        break;

      case 5:
        myClass = 'ticket-indicator-closed';
        break;
    }
    this.myClass = myClass as string;
    return this.myClass;
  }

  fetchTicketStatus(statusID: number) {
    return ENUMS.GlobalEnums.fetchTicketStatus(statusID);
  }
  fetchFaultType(faultID: number) {
    return ENUMS.GlobalEnums.fetchFaultNames(faultID);
  }
}
