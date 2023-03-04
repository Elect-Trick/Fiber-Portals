import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageTicketsPage } from './manage-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: ManageTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageTicketsPageRoutingModule {}
