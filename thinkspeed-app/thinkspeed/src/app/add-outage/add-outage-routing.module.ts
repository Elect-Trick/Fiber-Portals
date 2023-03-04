import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOutagePage } from './add-outage.page';

const routes: Routes = [
  {
    path: '',
    component: AddOutagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOutagePageRoutingModule {}
