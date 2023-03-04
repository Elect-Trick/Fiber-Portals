import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-outages',
  templateUrl: './outages.page.html',
  styleUrls: ['./outages.page.scss'],
})
export class OutagesPage implements OnInit {
  incident_form!: FormGroup;
PaginatedClosedTickets(arg0: string,_t293: any) {
throw new Error('Method not implemented.');
}
paginationArray: any;
closedPaginationArray:any;

paginatedTickets(arg0: string,_t284: any) {
throw new Error('Method not implemented.');
}
closedTotalEntries: any;
closedTickets: any;
fetchFaultDescriptor(arg0: any) {
throw new Error('Method not implemented.');
}
selectTicket(_t122: any) {
throw new Error('Method not implemented.');
}
tickets: any;
search($event: Event) {
throw new Error('Method not implemented.');
}
resetFilter() {
throw new Error('Method not implemented.');
}
technicians: any;
filterByTech() {
throw new Error('Method not implemented.');
}

type= 'open';
totalEntries: any;
tech: any;
segmentChanged(event: any) {
  this.type = event.detail.value;
  if (this.type == 'closed') {
    this.PaginatedClosedTickets('root', 1);
  } else {    // this.fetchClosedTickets();

    this.paginatedTickets('root', 1);
  }
}


  constructor() { }

  ngOnInit() {

  }

}
