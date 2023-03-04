import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageServicePage } from './manage-service.page';

const routes: Routes = [
  {
    path: '',
    component: ManageServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageServicePageRoutingModule {}
