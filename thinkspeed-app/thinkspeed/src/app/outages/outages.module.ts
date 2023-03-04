import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutagesPageRoutingModule } from './outages-routing.module';

import { OutagesPage } from './outages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutagesPageRoutingModule
  ],
  declarations: [OutagesPage]
})
export class OutagesPageModule {}
