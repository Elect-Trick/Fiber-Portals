import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessOrderPage } from './process-order.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessOrderPageRoutingModule {}
