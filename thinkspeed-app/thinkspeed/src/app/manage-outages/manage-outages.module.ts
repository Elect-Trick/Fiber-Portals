import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageOutagesPageRoutingModule } from './manage-outages-routing.module';

import { ManageOutagesPage } from './manage-outages.page';
import { AddOutagePage } from '../add-outage/add-outage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageOutagesPageRoutingModule
  ],
  declarations: []
})
export class ManageOutagesPageModule {}
