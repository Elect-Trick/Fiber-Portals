import { Subscription } from 'rxjs';
import { LocationSearch } from './../interfaces/location-search';
import { OutageComment } from './../interfaces/outage-comment';
import { ManageFaultsService } from './../services/manage-faults.service';
import {
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Outage } from '../interfaces/outage';
import { ENUMS } from '../Helpers/globalEnums';

@Component({
  selector: 'app-manage-outages',
  templateUrl: './manage-outages.page.html',
  styleUrls: ['./manage-outages.page.scss'],
})
export class ManageOutagesPage implements OnInit, OnDestroy {
  comments: OutageComment[] = [];
  comment: OutageComment = {
    outage_id: 0,
    comment: '',
    comment_date: new Date(),
    comment_by: '',
  };
  outageSearch: LocationSearch = {
    searchString: '',
  };
  searchString = '';
  closedFilter = false;
  openFilter = false;
  closedTickets: any;
  isModalOpen = false;
  updateModal = false;
  isFiltered = false;
  filter = [
    { id: 1, name: 'closed' },
    { id: 2, name: 'open' },
  ];
  type = '';
  update = '';
  activePage = 1;
  outages: Outage[] = [];
  paginationArray: number[] = [];
  totalEntries = 0;
  items_per_page = 6;
  selectedOutage: Outage = {
    outage_id: 0,
    outage_reference: '',
    incident_type: 0,
    severity: 0,
    date: new Date(),
    outage_status: 0,
    incident_report: '',
    affected_areas: [],
    last_updated: new Date(),
    description: '',
  };
  closeSub!: Subscription;
  incidentUpdateSub!: Subscription;
  outageSub!: Subscription;
  pageSub!: Subscription;
  commentSub!: Subscription;
  closedSub!: Subscription;
  IncidentName(incidentID: number) {
    return ENUMS.GlobalEnums.fetchIncidentType(incidentID);
  }
  StatusName(statusID: number) {
    return ENUMS.GlobalEnums.fetchIncidentStatus(statusID);
  }
  selectOutage(event: any) {
    if (event.detail.value != undefined) {
      this.presentLoader().then(() => {
        this.selectedOutage = this.outages.find(
          (z) => z.outage_reference == event.detail.value
        ) as Outage;
        this.fetchIncidentComments();
        this.loadingCtrl.dismiss();
      });
    }
  }

  resolve() {
    this.presentAlert().then();
  }
  search(event: any) {
    if (event.detail.value != '') {
      this.outageSearch.searchString = event.detail.value;
      this.outageSub = this.ticketService
        .findOutage(this.outageSearch)
        .subscribe({
          next: (response) => {
            if (response) {
              this.outages = response;
              this.isFiltered = true;
            }
          },
        });
    } else {
      this.paginatedOutages('root', 1);
    }
  }
  resetFilter() {
    this.type = '';
    this.isFiltered = false;
    this.paginatedOutages('root', 1);
  }
  filterByStatus() {
    console.log(this.filterBy);
    switch (this.filterBy) {
      case 'open':
        this.paginatedOutages('root', 1);
        break;

      case 'closed':
        this.closedOutages('root', 1);

        break;
    }
  }
  async closedOutages(direction: string, page: number) {
    this.filterBy = '';
    this.isFiltered = false;
    this.presentLoader().then(() => {
      switch (direction) {
        case 'root':
          this.activePage = page;

          this.closedSub = this.ticketService
            .fetchClosedOutages(page)
            .subscribe({
              next: (response) => {
                if (response) {
                  this.outages = response[0];
                  this.totalEntries = response[1];
                  this.preparePagination();
                }
              },
            });

          break;
      }
      this.loadingCtrl.dismiss();
    });
  }
  closedTotalEntries: any;
  filterBy!: any;

  constructor(
    private loadingCtrl: LoadingController,
    private ticketService: ManageFaultsService,
    private alertController: AlertController,
    private toastCtrl: ToastController
  ) {}
  ngOnDestroy(): void {
    if (this.incidentUpdateSub) {
      this.incidentUpdateSub.unsubscribe();
    }
    if (this.outageSub) {
      this.outageSub.unsubscribe();
    }
    if (this.pageSub) {
      this.pageSub.unsubscribe();
    }
    if (this.commentSub) {
      this.commentSub.unsubscribe();
    }
    if (this.closedSub) {
      this.closedSub.unsubscribe();
    }
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    this.clearData();
  }
  clearData() {
    this.selectedOutage = {
      outage_id: 0,
      outage_reference: '',
      incident_type: 0,
      severity: 0,
      date: new Date(),
      outage_status: 0,
      incident_report: '',
      affected_areas: [],
      last_updated: new Date(),
      description: '',
    };
    this.comments = [];
    this.outages = [];
    this.filter = [];
    this.outageSearch = {
      searchString: '',
    };
    this.paginationArray = [];
  }
  async OpenModal(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ngOnInit() {
    this.paginatedOutages('root', 1);
    this.type = 'open';
  }
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
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
          text: 'Close',
          role: 'ok',
          handler: () => {},
        },
      ],
    });
    return await toast.present();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Close Incident',
      message: 'Are you sure this has been resolved?',
      buttons: [
        {
          cssClass: 'alert-button-confirm',

          text: 'Confirm',
          handler: () => {
            this.markAsResolved(this.selectedOutage).then(() => {
              this.paginatedOutages('root', 1);
            });
            this.presentToast(
              `Outage ${this.selectedOutage.outage_reference} has been resolved`
            );
          },
          role: 'Ok',
        },
        { text: 'Cancel', handler: () => {}, role: 'Cancel' },
      ],
    });

    await alert.present();
  }
  async markAsResolved(outage: Outage) {
    this.closeSub = this.ticketService.closeOutage(outage).subscribe({
      next: (response) => {
        if (response) {
          console.log('Outage has been closed, present toast');
        }
      },
    });
  }
  triggerUpdate(trigger: boolean) {
    this.updateModal = trigger;
    console.log(this.updateModal);
  }
  async preparePagination() {
    this.paginationArray = [];
    let rowCount = Math.ceil(this.totalEntries / this.items_per_page);
    for (let index = 1; index <= rowCount; index++) {
      this.paginationArray.push(index);
    }
  }

  postUpdate() {
    console.log(this.update);
    if (this.update != '') {
      this.comment.comment = this.update;
      this.comment.outage_id = this.selectedOutage.outage_id;
      let token = localStorage.getItem('token');
      if (token) {
        let userItem = JSON.parse(atob(token.split('.')[1]));
        this.comment.comment_by = userItem.username;
      }
      console.log(this.comment);

      this.presentLoader().then(() => {
        this.incidentUpdateSub = this.ticketService
          .postIncidentUpdate(this.comment)
          .subscribe({
            next: (response) => {
              this.loadingCtrl.dismiss();
              if (response) {
                this.triggerUpdate(false);
                this.update = '';
                this.fetchIncidentComments();
                this.presentToast(
                  `Outage ${this.selectedOutage.outage_reference} has been updated`
                );
              }
            },
          });
      });
    }
  }

  async paginatedOutages(direction: string, page: number) {
    this.presentLoader().then(() => {
      this.filterBy = '';
      this.isFiltered = false;
      switch (direction) {
        case 'root':
          this.activePage = page;

          this.pageSub = this.ticketService
            .getPaginatedOutages(page)
            .subscribe({
              next: (response) => {
                if (response) {
                  this.outages = response[0];
                  this.totalEntries = response[1];
                  this.preparePagination();
                }
              },
              complete: () => {
                setTimeout(() => {
                  this.loadingCtrl.dismiss();
                }, 250);
              },
            });

          break;
      }
    });
  }
  async fetchIncidentComments() {
    this.commentSub = this.ticketService
      .fetchIncidentComments(this.selectedOutage)
      .subscribe({
        next: (response) => {
          if (response) {
            this.comments = response;
          }
        },
      });
  }

  toggleFilter(event: any, type: string) {
    if (type == 'open' && event.detail.checked == 'true') {
      this.openFilter = true;
      this.closedFilter = false;
    } else if (type == 'closed' && event.detail.checked == 'true') {
      this.openFilter = false;
      this.closedFilter = true;
    }
  }

  segmentChanged(event: any) {
    this.totalEntries = 0;
    this.type = event.detail.value;
    switch (this.type) {
      case 'open':
        this.paginatedOutages('root', 1);
        break;

      case 'closed':
        this.closedOutages('root', 1);

        break;
    }
  }
  goToPage(direction: string, page: number) {
    switch (this.type) {
      case 'open':
        this.paginatedOutages('root', page);

        break;

      case 'closed':
        this.closedOutages('root', page);
        break;
      default:
        this.paginatedOutages(direction, 1);
    }
  }

  resetData() {
    this.selectedOutage = {
      outage_id: 0,
      outage_reference: '',
      incident_type: 0,
      severity: 0,
      date: new Date(),
      outage_status: 0,
      incident_report: '',
      affected_areas: [],
      last_updated: new Date(),
      description: '',
    };
    this.paginatedOutages('root', 1);
    this.searchString = '';
  }
}
