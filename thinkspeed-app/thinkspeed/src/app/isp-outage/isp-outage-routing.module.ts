import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IspOutagePage } from './isp-outage.page';

const routes: Routes = [
  {
    path: '',
    component: IspOutagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IspOutagePageRoutingModule {}
