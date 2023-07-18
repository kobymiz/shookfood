import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipesRoutingModule } from './recipes-routing.module';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';

@NgModule({
  declarations: [
    RecipesListComponent,
    ViewRecipeComponent
    ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RecipesModule { }
