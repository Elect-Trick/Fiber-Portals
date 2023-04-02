import { SduLocation } from './../interfaces/sdu-location';
import { LocationServiceService } from './../services/location-service.service';
import { Subscription } from 'rxjs';
import { Outage } from './../interfaces/outage';
import { LoadingController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Comment } from '../interfaces/comment';
import { MduComplex } from '../interfaces/mdu-complex';
import { SduLocations } from '../interfaces/sdu-locations';
import { LocationSearch } from '../interfaces/location-search';
import { Location } from '../interfaces/location';
import { LocationEntity } from '../interfaces/location-entity';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit, OnDestroy {
  locations: MduComplex[] = [];
  locationSearch: LocationSearch = {
    searchString: '',
  };
  searchResults: LocationEntity[] = [];
  sduLocations: SduLocations[] = [];
  sduEntries = 0;
  mduEntries = 0;
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
  sduPaginationArray: number[] = [];
  mduPaginationArray: number[] = [];
  comments: Comment[] = [];
  totalEntries: any;
  filterBy = '';
  isFiltered = false;
  activePage = 1;
  pageSub!: Subscription;
  locationSub!: Subscription;
  selectedLocation: MduComplex = {
    location_id: 0,
    complex_name: '',
    units: [],
  };
  selectedSDU: SduLocations = {
    location_id: 0,
    street_name: '',
    units: [],
  };
  isFound = false;
  items_per_page = 2;
  tempStorage: any[] = [];
  tempSDUstorage: any[] = [];
  type = 'mdu';
  tempUnitStore: SduLocations = {
    location_id: 0,
    street_name: '',
    units: [],
  };
  sduSub!: Subscription;
  mduSub!: Subscription;
  sduSub2!: Subscription;
  unitSub!: Subscription;
  unitSub2!: Subscription;

  constructor(
    private locationService: LocationServiceService,
    private loadingCtrl: LoadingController
  ) {}
  ngOnDestroy(): void {
    this.clearAll();
    if (this.locationSub) {
      this.locationSub.unsubscribe();
    }
    if (this.sduSub) {
      this.sduSub.unsubscribe();
    }
    if (this.mduSub) {
      this.mduSub.unsubscribe();
    }
    if (this.sduSub2) {
      this.sduSub2.unsubscribe();
    }
    if (this.unitSub) {
      this.unitSub.unsubscribe();
    }
    if (this.unitSub2) {
      this.unitSub2.unsubscribe();
    }
  }
  clearAll() {
    this.mduPaginationArray = [];
    this.sduPaginationArray = [];
    this.locations = [];
    this.sduLocations = [];
    this.tempStorage = [];
    this.tempSDUstorage = [];
  }
  async ngOnInit() {
    this.paginatedMDUs('root', 1);
    // this.paginatedSDUs('root', 1);
  }
  segmentChanged(event: any) {
    this.presentLoader().then(() => {
      this.type = event.detail.value;

      switch (this.type) {
        case 'sdu':
          if (!this.sduSub) {
            this.paginatedSDUs('root', 1);
          }

          break;

        case 'mdu':
          this.preparePagination();

          break;
      }
      this.preparePagination();

      this.loadingCtrl.dismiss();
    });
  }

  complexSearch(event: any) {
    if (event.detail.value !== '') {
      this.locations = this.locations.filter((z) =>
        z.complex_name.includes(event.detail.value)
      );
    } else {
      this.presentLoader().then(() => {
        this.locations = this.tempStorage;
        this.loadingCtrl.dismiss();
      });
    }
  }
  search(event: any) {
    if (event.detail.value !== '') {
      this.locationSearch.type = this.type;
      this.locationSearch.searchString = event.detail.value;
      this.locationSub = this.locationService
        .findLocation(this.locationSearch)
        .subscribe({
          next: (response) => {
            this.searchResults = response;
            this.isFound = true;
          },
        });
    } else {
      this.presentLoader().then(() => {
        this.isFound = false;
        this.searchResults = [];
        switch (this.type) {
          case 'sdu':
            this.sduLocations = this.tempSDUstorage;
            this.loadingCtrl.dismiss();
            break;

          case 'mdu':
            this.locations = this.tempStorage;
            this.loadingCtrl.dismiss();
            break;
        }
      });
    }
  }

  selectSearchedLocation(location: LocationEntity) {
    this.presentLoader().then(() => {
      this.isFound = false;
      // call API to retrieve uints associated with selected location.
      location.type = this.type;
      this.retrieveUnits(location);
      this.loadingCtrl.dismiss();
    });
  }

  // Fetches units asociated with an address
  retrieveUnits(location: LocationEntity) {
    location.type = this.type;
    switch (this.type) {
      case 'sdu':
        this.unitSub = this.locationService.retrieveUnits(location).subscribe({
          next: (response) => {
            if (response) {
              this.sduLocations = response.streets;
            }
          },
        });
        break;

      case 'mdu':
        this.unitSub2 = this.locationService.retrieveUnits(location).subscribe({
          next: (response) => {
            if (response) {
              this.locations = response.complexes;
            }
          },
        });
        break;
    }
  }
  IncidentName(incidentID: number) {}
  StatusName(incidentID: number) {}
  triggerUpdate(event: any) {}
  async paginatedMDUs(direction: string, page: number) {
    this.presentLoader().then(() => {
      this.mduSub = this.locationService.paginatedMdus(page).subscribe({
        next: async (response) => {
          if (response) {
            this.locations = response.complexes;
            this.tempStorage = response.complexes;
            this.mduEntries = response.totalEntries;
            this.preparePagination();
            this.loadingCtrl.dismiss();
          } else {
            this.loadingCtrl.dismiss();
          }
        },
      });
    });
  }

  async paginatedSDUs(direction: string, page: number) {
    this.presentLoader().then(() => {
      this.sduSub = this.locationService.paginatedSdus(page).subscribe({
        next: async (response) => {
          if (response) {
            this.sduLocations = response.streets;
            this.tempSDUstorage = response.streets;
            this.sduEntries = response.totalEntries;
            this.preparePagination();

            // this.loadingCtrl.dismiss();
          } else {
          }
        },
      });
      this.loadingCtrl.dismiss();
    });
  }
  async presentLoader() {
    const loader = await this.loadingCtrl.create({
      message: 'Busy....',
    });
    return await loader.present();
  }
  selectMduLocation(event: any) {
    if (event.detail.value != undefined) {
      this.selectedLocation = { location_id: 0, complex_name: '', units: [] };
      this.presentLoader().then(() => {
        this.selectedLocation = this.locations.find(
          (z) => z.location_id == event.detail.value
        ) as MduComplex;
        this.totalEntries = this.selectedLocation.units.length;
        this.loadingCtrl.dismiss();
      });
    }
  }

  selectSDU(event: any) {
    if (event.detail.value != undefined) {
      this.presentLoader().then(() => {
        this.selectedSDU = this.sduLocations.find(
          (z) => z.location_id == event.detail.value
        ) as SduLocations;
        this.totalEntries = this.selectedLocation.units.length;
        this.loadingCtrl.dismiss();
      });
    }
  }
  goToPage(page: number) {}
  preparePagination() {
    this.items_per_page = 2;
    this.items_per_page = 2;
    switch (this.type) {
      case 'sdu':
        this.sduPaginationArray = [];
        let sduCount = Math.ceil(this.sduEntries / this.items_per_page);
        for (let index = 1; index < sduCount - 1; index++) {
          this.sduPaginationArray.push(index);
        }
        break;

      case 'mdu':
        this.mduPaginationArray = [];
        console.log(typeof this.mduEntries);
        let mduCount = Math.ceil(this.mduEntries / this.items_per_page);
        console.log(mduCount);

        for (let index = 1; index < mduCount + 1; index++) {
          this.mduPaginationArray.push(index);
        }

        break;
    }
  }

  serviceStatus(statusID: boolean) {
    return statusID == false ? false : true;
  }
}
