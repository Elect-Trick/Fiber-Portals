import { OrderStatusPipe } from './order-status.pipe';
import { EditOrderPage } from './edit-order/edit-order.page';
import { ManageOrdersPage } from './manage-orders/manage-orders.page';
import { ManageOutagesPage } from './manage-outages/manage-outages.page';
import { PlaceOrderPage } from './place-order/place-order.page';
import { FolderPage } from './folder/folder.page';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HomePage } from './home/home.page';
import { HomePageModule } from './home/home.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AddUserPage } from './add-user/add-user.page';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgChartsModule } from 'ng2-charts';
import { AddLocationPage } from './add-location/add-location.page';
import { GoogleMapsModule } from '@angular/google-maps';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { AddOutagePage } from './add-outage/add-outage.page';
import { TinyintPipe } from './tinyint.pipe';
import { ProcessOrderPage } from './process-order/process-order.page';
import { ManageTicketsPage } from './manage-tickets/manage-tickets.page';



@NgModule({
  declarations: [
    AppComponent,
    FolderPage,
    HomePage,
    AddUserPage,
    PlaceOrderPage,
    AddOutagePage,
    AddLocationPage,
    ManageOutagesPage,ManageOrdersPage,EditOrderPage,TinyintPipe,OrderStatusPipe,ProcessOrderPage,ManageTicketsPage



  ],
  imports: [

    NgChartsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HomePageModule,
    HttpClientModule,
    FormsModule,
    GoogleChartsModule,
    GoogleMapsModule,
    GooglePlaceModule


  ],
  exports: [],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
