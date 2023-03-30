import { Comment } from './../interfaces/comment';
import { Subscription } from 'rxjs';
import { OrdersService } from './../services/orders.service';
import { ManageFaultsService } from './../services/manage-faults.service';
import {
  IonAccordionGroup,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Ticket } from '../interfaces/ticket';
import { ENUMS } from '../Helpers/globalEnums';
import { Location } from '../interfaces/location';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../interfaces/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-tickets',
  templateUrl: './manage-tickets.page.html',
  styleUrls: ['./manage-tickets.page.scss'],
})
export class ManageTicketsPage implements OnInit, OnDestroy {
  type = 'open';
  @ViewChild('accordionGroup', { static: true })
  accordionGroup!: IonAccordionGroup;
  ticket = '';
  tickets: Ticket[] = [];
  closedTickets: Ticket[] = [];
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
    organization_id: 0,
    technician: '',
  };
  isFiltered = false;

  comment: Comment = {
    comment_id: 0,
    ticket_id: 0,
    service_id: 0,
    replier_email: '',
    comment: '',
    location_id: 0,
    location_type: '',
    reply_date: '',
  };
  comments: Comment[] = [];
  selectedTech: User = {
    user_id: 0,
    account_name: '',
    email: '',
    organization: 0,
    role: 0,
    token: '',
  };
  location_string = '';
  activePage = 1;
  totalEntries: any;
  closedTotalEntries = 0;
  items_per_page = 6;
  paginationArray: number[] = [];
  closedPaginationArray: number[] = [];
  location: Location = {
    location_id: 0,
    location_string: '',
  };
  isResolved = false;
  locationSub!: Subscription;
  technicians: User[] = [];
  tech = '';
  assigned = false;
  commentSub!: Subscription;
  tempStorage: Ticket[] = [];
  closedTempStorage: Ticket[] = [];
  closedPagination!: Subscription;
  ticketSub!: Subscription;
  ticketSub2!: Subscription;
  techSub!: Subscription;
  openTSub!: Subscription;
  commentSub2!: Subscription;
  commentForm!: FormGroup;
  constructor(
    private ticketService: ManageFaultsService,
    private loadingCtrl: LoadingController,
    private orderService: OrdersService,
    private toastCtrl: ToastController
  ) {}
  ngOnDestroy(): void {
    this.clearSelection();
    this.clearAll();
    if (this.commentSub) {
      this.commentSub.unsubscribe();
    }
    if (this.closedPagination) {
      this.closedPagination.unsubscribe();
    }
    if (this.ticketSub) {
      this.ticketSub.unsubscribe();
    }
    if (this.ticketSub2) {
      this.ticketSub2.unsubscribe();
    }
    if (this.techSub) {
      this.techSub.unsubscribe();
    }
    if (this.openTSub) {
      this.openTSub.unsubscribe();
    }
    if (this.commentSub2) {
      this.commentSub2.unsubscribe();
    }
  }

  ngOnInit() {
    this.paginatedTickets('root', 1).then(() => {
      this.openAccordion();
      this.fetchTechnicians();
    });
  }

  buildForm(){
    return this.commentForm = new FormGroup({
      comment: new FormControl('',[Validators.required,Validators.minLength(15)])
    })

  }
  async markAsResolved() {
    this.isResolved = true;
    this.buildForm();
  }

  logDispute() {

    this.comment.ticket_id = this.selectedTicket.ticket_id;
    this.comment.service_id = this.selectedTicket.service_id;
    this.comment.location_id = this.selectedTicket.location_id;
    this.comment.comment = this.commentForm.controls['comment'].value;
    this.comment.location_type = this.selectedTicket.location_type;    let token = localStorage.getItem('token');
    if (token) {
      let userItem = JSON.parse(atob(token.split('.')[1]));
      this.comment.replier_email = userItem.username;
    }
    this.presentLoader().then(() => {
      this.commentSub = this.ticketService.postComment(this.comment).subscribe({
        next: (response) => {
          if (response) {
            this.resolved(this.selectedTicket).then(() => {
                          });
          } else {
            console.log('Failed to post comment');
          }
        },
      });
      this.loadingCtrl.dismiss();
    });
  }
  async resolved(ticket: Ticket) {
    this.ticketService.markasResolved(ticket).subscribe({
      next: (response) => {
        if (response) {
          this.presentFilterToast(
            'Ticket marked as resolved, waiting for isp to confirm'
          );
          this.toggleAccordion().then(() => {
            this.paginationArray = [];
            this.preparePagination();
            this.paginatedTickets('root', 1);
            this.clearSelection();
          });
        } else {
        }
      },
    });
  }

  async fetchComments(ticket: Ticket) {
    this.commentSub2 = this.ticketService.fetchComments(ticket).subscribe({
      next: (response) => {
        if (response) {
          this.comments = response;
        } else {
        }
      },
    });
  }
  async openAccordion() {
    const nativeEl = this.accordionGroup;
    nativeEl.value = 'ticket-list';
  }
  async toggleAccordion() {
    const nativeEl = this.accordionGroup;
    switch (nativeEl.value) {
      case 'ticket-list':
        nativeEl.value = 'ticket-info';
        break;

      default:
        nativeEl.value = 'ticket-list';
        break;
    }
  }

  segmentChanged(event: any) {
    this.type = event.detail.value;
    if (this.type == 'closed') {
      this.presentLoader().then(() => {
        if (!this.closedPagination) {
          this.PaginatedClosedTickets('root', 1);
        }
        this.loadingCtrl.dismiss();
      });
    } else {
      this.paginatedTickets('root', 1);
    }
  }
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
    });
    return await loader.present();
  }

  selectTicket(ticket: Ticket) {
    this.presentLoader().then(() => {
      this.selectedTicket = ticket;
      this.prepareLocationObject();
      this.fetchComments(this.selectedTicket);
      this.assigned = this.selectedTicket.technician === '' ? false : true;
      console.log(this.assigned);
      this.toggleAccordion().then(() => {
        this.loadingCtrl.dismiss();
      });
    });
  }
  selectTech(event: any) {
    console.log(event.detail.value);
    this.selectedTech.role = event.detail.value;
  }

  async preparePagination() {
    switch (this.type) {
      case 'open':
        this.paginationArray = [];
        let rowCount = Math.ceil(this.totalEntries / this.items_per_page);
        for (let index = 1; index <= rowCount; index++) {
          this.paginationArray.push(index);
        }
        break;

      case 'closed':
        this.closedPaginationArray = [];
        let closedCount = Math.ceil(
          this.closedTotalEntries / this.items_per_page
        );

        for (let index = 1; index <= closedCount; index++) {
          this.closedPaginationArray.push(index);
        }
        break;
    }
  }

  async paginatedTickets(direction: string, page: number) {
    this.tech = '';
    this.isFiltered = false;
    this.presentLoader().then(() => {
      switch (direction) {
        case 'root':
          this.activePage = page;

          this.openTSub = this.ticketService
            .getPaginatedTickets(page)
            .subscribe({
              next: (response) => {
                if (response) {
                  this.tickets = response.tickets;
                  this.totalEntries = response.totalEntries;
                  this.preparePagination();
                }
              },
            });
          this.loadingCtrl.dismiss();

          break;
      }
    });
  }
  async PaginatedClosedTickets(direction: string, page: number) {
    this.tech = '';
    this.isFiltered = false;

    this.presentLoader().then(() => {
      switch (direction) {
        case 'root':
          this.closedPagination = this.ticketService
            .PaginatedClosedTickets(page)
            .subscribe({
              next: (response) => {
                if (response) {
                  this.closedTickets = response.tickets;
                  this.closedTotalEntries = response.totalEntries;
                  this.preparePagination();
                }
              },
            });

          break;
      }
      this.loadingCtrl.dismiss();
    });
  }

  fetchFaultDescriptor(faultID: number) {
    return ENUMS.GlobalEnums.fetchFaultNames(faultID);
  }
  fetchISPImages(orgnanizationID: number) {
    return ENUMS.GlobalEnums.fetchISPImages(orgnanizationID);
  }
  fetchTicketStatus(statusID: number) {
    return ENUMS.GlobalEnums.fetchTicketStatus(statusID);
  }
  fetchFaultNames(faultID: number) {
    return ENUMS.GlobalEnums.fetchFaultNames(faultID);
  }
  backToTickets() {
    this.presentLoader()
      .then(() => {
        this.toggleAccordion();
        this.clearSelection();
      })
      .finally(() => {
        this.loadingCtrl.dismiss();
      });
  }

  async prepareLocationObject() {
    this.location.location_id = this.selectedTicket.location_id;
    this.location.location_string = this.selectedTicket.location_type;
    this.locationSub = this.orderService
      .findLocationwithID(this.location)
      .subscribe({
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

  async fetchTechnicians() {
    this.techSub = this.ticketService.fetchTechnicians().subscribe({
      next: (response) => {
        if (response) {
          this.technicians = response;
        }
      },
    });
  }

  async assignTicket(event: any) {
    this.selectedTicket.technician = event.detail.value;
    console.log(this.selectedTicket.technician);
    this.ticketSub2 = this.ticketService
      .assignTicket(this.selectedTicket)
      .subscribe({
        next: (response) => {
          if (response) {
            this.assigned = true;
          }
        },
      });
  }
  async fetchAllTickets(): Promise<Ticket[]> {
    this.ticketSub = this.ticketService.fetchAllTickets().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.tempStorage = response;

          this.tickets = this.tempStorage;
        }
      },
    });
    return this.tickets;
  }
  async filterByTech() {
    this.isFiltered = true;
    switch (this.type) {
      case 'open':
        this.tickets = this.tempStorage;
        this.tickets = this.tickets.filter((z) => z.technician == this.tech);

        break;

      default:
        this.closedTickets = this.closedTempStorage;
        this.closedTickets = this.tickets.filter(
          (z) => z.technician == this.tech
        );

        break;
    }
  }
  async resetFilter() {
    switch (this.type) {
      case 'open':
        if (this.isFiltered) {
          this.tech = '';
          this.paginatedTickets('root', 1);
          this.isFiltered = false;
        } else {
          this.presentFilterToast(
            'Filter is not applied, please filter before Resetting',
            1500
          );
        }

        break;

      default:
        if (this.isFiltered) {
          this.tech = '';
          this.isFiltered = false;
          this.PaginatedClosedTickets('root', 1);
        } else {
          this.presentFilterToast(
            'Filter is not applied, please filter before Resetting',
            1500
          );
        }
        break;
    }
  }

  async presentFilterToast(_message: string, _duration?: number) {
    const toast = await this.toastCtrl.create({
      message: _message,
      position: 'middle',
      duration: _duration,
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

  search(event: any) {
    let searchString = event.detail.value;
    if (searchString != '') {
      switch (this.type) {
        case 'open':
          this.tickets = this.tempStorage;
          this.tickets = this.tickets.filter(
            (z) => z.ticket_reference == searchString
          );
          break;

        default:
          console.log('closed section', this.closedTempStorage);
          this.closedTickets = this.closedTempStorage;
          this.closedTickets = this.closedTickets.filter(
            (z) => z.ticket_reference == searchString
          );
          break;
      }
    } else {
      switch (this.type) {
        case 'open':
          this.paginatedTickets('root', 1);
          break;

        default:
          this.PaginatedClosedTickets('root', 1);

          break;
      }
    }
  }
  clearAll() {
    this.tempStorage = [];
    this.closedTempStorage = [];
    this.comments = [];
    this.technicians = [];
    this.closedTickets = [];
    this.tickets = [];
    this.closedPaginationArray = [];
    this.paginationArray = [];
  }
  clearSelection() {
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
      organization_id: 0,
      technician: '',
    };
    this.assigned = false;
    this.isResolved = false;
    this.comments = [];
  }
}
