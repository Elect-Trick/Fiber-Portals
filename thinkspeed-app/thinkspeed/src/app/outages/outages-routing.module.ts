import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutagesPage } from './outages.page';

const routes: Routes = [
  {
    path: '',
    component: OutagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutagesPageRoutingModule {}
