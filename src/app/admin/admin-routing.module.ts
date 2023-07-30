import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpsertMenuItemComponent } from './menu-admin/upsert-menu-item/upsert-menu-item.component';

const routes: Routes = [{
  path: '', redirectTo: '/admin/menu', pathMatch: 'full'
},{
  path: 'menu',
  component: UpsertMenuItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
