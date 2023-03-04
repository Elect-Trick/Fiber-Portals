import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageServicePageRoutingModule } from './manage-service-routing.module';

import { ManageServicePage } from './manage-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageServicePageRoutingModule
  ],
  declarations: [ManageServicePage]
})
export class ManageServicePageModule {}
