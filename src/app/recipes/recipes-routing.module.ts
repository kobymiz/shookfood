import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { ViewRecipeComponent } from './view-recipe/view-recipe.component';

const routes: Routes = [{
  path: '', redirectTo: '/recipes/list', pathMatch: 'full'
},{
  path: 'list',
  component: RecipesListComponent
},{
  path: 'view/:id',
  component: ViewRecipeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
