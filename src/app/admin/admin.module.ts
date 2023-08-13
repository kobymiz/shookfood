import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { UpsertMenuItemComponent } from './menu-admin/upsert-menu-item/upsert-menu-item.component';
import { SharedModule } from '../shared.module';
import { MenuBuilderComponent } from './menu-admin/menu-builder/menu-builder.component';
import { IngredientsCatalogComponent } from './menu-admin/ingredients-catalog/ingredients-catalog.component';

@NgModule({
  declarations: [
    UpsertMenuItemComponent,
    MenuBuilderComponent,
    IngredientsCatalogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AdminModule { }
