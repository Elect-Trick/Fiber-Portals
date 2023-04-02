import { HomePage } from './home/home.page';
import { FolderPage } from './folder/folder.page';
import { LoginGuard } from './guards/login.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: FolderPage,
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'folder',
    component: FolderPage,
    pathMatch: 'full',
    canActivate: [LoginGuard],
  },
  {
    path: 'folder/:id',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
  {
    path: 'place-order',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./place-order/place-order.module').then(
        (m) => m.PlaceOrderPageModule
      ),
  },
  {
    path: 'add-user',
    // canActivate: [LoginGuard],
    loadChildren: () =>
      import('./add-user/add-user.module').then((m) => m.AddUserPageModule),
  },
  {
    path: 'manage-users',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./manage-users/manage-users.module').then(
        (m) => m.ManageUsersPageModule
      ),
  },
  {
    path: 'edit-user',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./edit-user/edit-user.module').then((m) => m.EditUserPageModule),
  },
  {
    path: 'order-status',
    canActivate: [LoginGuard],

    loadChildren: () =>
      import('./order-status/order-status.module').then(
        (m) => m.OrderStatusPageModule
      ),
  },
  {
    path: 'view-order',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./view-order/view-order.module').then(
        (m) => m.ViewOrderPageModule
      ),
  },
  {
    path: 'manage-service',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./manage-service/manage-service.module').then(
        (m) => m.ManageServicePageModule
      ),
  },
  {
    path: 'tickets',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./tickets/tickets.module').then((m) => m.TicketsPageModule),
  },
  {
    path: 'invoices',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./invoices/invoices.module').then((m) => m.InvoicesPageModule),
  },
  {
    path: 'manage-orders',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./manage-orders/manage-orders.module').then(
        (m) => m.ManageOrdersPageModule
      ),
  },
  {
    path: 'manage-tickets',
    canActivate: [LoginGuard],

    loadChildren: () =>
      import('./manage-tickets/manage-tickets.module').then(
        (m) => m.ManageTicketsPageModule
      ),
  },
  {
    path: 'outages',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./outages/outages.module').then((m) => m.OutagesPageModule),
  },
  {
    path: 'locations',
    canActivate: [LoginGuard],

    loadChildren: () =>
      import('./locations/locations.module').then((m) => m.LocationsPageModule),
  },
  {
    path: 'add-location',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./add-location/add-location.module').then(
        (m) => m.AddLocationPageModule
      ),
  },
  {
    canActivate: [LoginGuard],
    path: 'manage-outages',
    loadChildren: () =>
      import('./manage-outages/manage-outages.module').then(
        (m) => m.ManageOutagesPageModule
      ),
  },
  {
    canActivate: [LoginGuard],
    path: 'add-outage',
    loadChildren: () =>
      import('./add-outage/add-outage.module').then(
        (m) => m.AddOutagePageModule
      ),
  },
  {
    canActivate: [LoginGuard],
    path: 'isp-outage',
    loadChildren: () =>
      import('./isp-outage/isp-outage.module').then(
        (m) => m.IspOutagePageModule
      ),
  },
  {
    canActivate: [LoginGuard],
    path: 'edit-order',
    loadChildren: () =>
      import('./edit-order/edit-order.module').then(
        (m) => m.EditOrderPageModule
      ),
  },
  {
    path: 'process-order',
    loadChildren: () => import('./process-order/process-order.module').then( m => m.ProcessOrderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
