import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpsertMenuItemComponent } from './menu-admin/upsert-menu-item/upsert-menu-item.component';
import { MenuBuilderComponent } from './menu-admin/menu-builder/menu-builder.component';

const routes: Routes = [
  {
  path: '', redirectTo: '/admin/menu-items', pathMatch: 'full'
  },
  {
    path: 'menu-items',
    component: UpsertMenuItemComponent
  },
  {
    path: 'menu-builder',
    component: MenuBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
