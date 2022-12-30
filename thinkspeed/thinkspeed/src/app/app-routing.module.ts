import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', component:LoginComponent, pathMatch:'full'},
  {path:'admin', component:AdminComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
