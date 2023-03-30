import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessOrderPageRoutingModule } from './process-order-routing.module';

import { ProcessOrderPage } from './process-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessOrderPageRoutingModule
  ],
  declarations: []
})
export class ProcessOrderPageModule {}
