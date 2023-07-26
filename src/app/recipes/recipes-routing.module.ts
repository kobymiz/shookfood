import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';
import { UpsertRecipeComponent } from './upsert-recipe/upsert-recipe.component';
import { authGuard } from '../auth-guard';

const routes: Routes = [{
  path: '', redirectTo: '/recipes/list', pathMatch: 'full'
},{
  path: 'list',
  component: RecipesListComponent
},{
  path: 'view/:id',
  component: ViewRecipeComponent
},{
  path: 'upsert',
  component: UpsertRecipeComponent,
  canActivate: [authGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
