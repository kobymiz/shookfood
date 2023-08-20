import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpsertMenuItemComponent } from './menu-admin/upsert-menu-item/upsert-menu-item.component';
import { MenuBuilderComponent } from './menu-admin/menu-builder/menu-builder.component';
import { IngredientsCatalogComponent } from './menu-admin/ingredients-catalog/ingredients-catalog.component';
import { AdminHomePageComponent } from './admin-homepage.component';
import { AdminWorkshopComponent } from './workshop/admin-workshop.component';

const routes: Routes = [
  {
  path: '', component: AdminHomePageComponent
  },
  {
    path: 'menu-items',
    component: UpsertMenuItemComponent
  },
  {
    path: 'menu-builder',
    component: MenuBuilderComponent
  },
  {
    path: 'ingredients-catalog',
    component: IngredientsCatalogComponent
  },
  {
    path: 'workshop',
    component: AdminWorkshopComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
