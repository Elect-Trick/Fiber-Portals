import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddOutagePageRoutingModule } from './add-outage-routing.module';

import { AddOutagePage } from './add-outage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOutagePageRoutingModule
  ],
  declarations: []
})
export class AddOutagePageModule {}
