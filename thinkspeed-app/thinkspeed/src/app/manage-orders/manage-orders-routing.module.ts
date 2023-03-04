import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageOrdersPage } from './manage-orders.page';

const routes: Routes = [
  {
    path: '',
    component: ManageOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageOrdersPageRoutingModule {}
