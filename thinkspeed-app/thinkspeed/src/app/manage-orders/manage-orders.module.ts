import { OrderStatusPipe } from './../order-status.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageOrdersPageRoutingModule } from './manage-orders-routing.module';



@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ManageOrdersPageRoutingModule,

    ]
})
export class ManageOrdersPageModule {}
