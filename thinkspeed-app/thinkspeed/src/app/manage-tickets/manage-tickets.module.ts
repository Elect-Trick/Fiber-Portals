import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageTicketsPageRoutingModule } from './manage-tickets-routing.module';

import { ManageTicketsPage } from './manage-tickets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTicketsPageRoutingModule
  ],
  declarations: [ManageTicketsPage]
})
export class ManageTicketsPageModule {}
