import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IspOutagePageRoutingModule } from './isp-outage-routing.module';

import { IspOutagePage } from './isp-outage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IspOutagePageRoutingModule
  ],
  declarations: [IspOutagePage]
})
export class IspOutagePageModule {}
