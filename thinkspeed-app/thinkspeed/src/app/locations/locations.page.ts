import { LocationServiceService } from './../services/location-service.service';
import { Subscription } from 'rxjs';
import { Outage } from './../interfaces/outage';
import { LoadingController } from '@ionic/angular';
import { ManageFaultsService } from './../services/manage-faults.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Comment } from '../interfaces/comment';
import { MduComplex } from '../interfaces/mdu-complex';
import { Complex } from '../interfaces/complex';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit, OnDestroy {
  locations: MduComplex[] = [];
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
  };
  paginationArray: number[] = [];
  comments: Comment[] = [];
  totalEntries: any;
  filterBy = '';
  isFiltered = false;
  activePage = 1;
  pageSub!: Subscription;
  locationSub!: Subscription;
  selectedLocation: MduComplex = {
    complex_name: '',
    units: [],
  };
  items_per_page = 4;
  tempStorage: any[] = [];

  constructor(
    private locationService: LocationServiceService,
    private loadingCtrl: LoadingController
  ) {}
  ngOnDestroy(): void {
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
  }
  ngOnInit(): void {
    // this.paginatedOutages('root',1);
    this.resolve();
  }
  segmentChanged(event: any) {}
  onSearchChange(event: any) {}
  IncidentName(incidentID: number) {}
  StatusName(incidentID: number) {}
  triggerUpdate(event: any) {}
  resolve() {
    this.locationSub = this.locationService.fetchMdus().subscribe({
      next: (response) => {
        if (response) {
          this.locations = response;
          this.tempStorage = response;
        }
      },
    });
  }
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
    });
    return await loader.present();
  }
  selectLocation(event: any) {
    if (event.detail.value != undefined) {
      // this.locations = this.tempStorage;
      // this.totalEntries = 0;
      this.selectedLocation = { complex_name: '', units: [] };
      this.presentLoader().then(() => {
        this.selectedLocation = this.locations.find(
          (z) => z.complex_name == event.detail.value
        ) as MduComplex;
        this.totalEntries = this.selectedLocation.units.length;
        this.loadingCtrl.dismiss();

        // console.log(this.selectedLocation.units);
      });
    }
  }
  goToPage(page: number) {}
  async preparePagination() {
    this.paginationArray = [];
    let rowCount = Math.ceil(this.totalEntries / this.items_per_page);
    for (let index = 1; index <= rowCount; index++) {
      this.paginationArray.push(index);
    }
  }

  serviceStatus(statusID: boolean) {
    return statusID == false ? false : true;
  }

  unitSearch(event:any){

  }
}
