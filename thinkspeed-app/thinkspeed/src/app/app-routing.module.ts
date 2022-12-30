import { FolderPage } from './folder/folder.page';
import { LoginGuard } from './guards/login.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: FolderPage,
    pathMatch: 'full',
    canActivate: [LoginGuard],
  } , {
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
    canActivate: [LoginGuard],
    loadChildren: () => import('./add-user/add-user.module').then( m => m.AddUserPageModule)
  },
  {
    path: 'manage-users',
    canActivate: [LoginGuard],
    loadChildren: () => import('./manage-users/manage-users.module').then( m => m.ManageUsersPageModule)
  },
  {
    path: 'edit-user',
    canActivate: [LoginGuard],
    loadChildren: () => import('./edit-user/edit-user.module').then( m => m.EditUserPageModule)
  },
  {
    path: 'order-status',
    loadChildren: () => import('./order-status/order-status.module').then( m => m.OrderStatusPageModule)
  },
  {
    path: 'view-order',
    loadChildren: () => import('./view-order/view-order.module').then( m => m.ViewOrderPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
