import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageOutagesPage } from './manage-outages.page';

const routes: Routes = [
  {
    path: '',
    component: ManageOutagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageOutagesPageRoutingModule {}
