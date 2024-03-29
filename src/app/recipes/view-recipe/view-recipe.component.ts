import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../data-model/recipes-data-model';
import { Location } from '@angular/common';


@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html'
})
export class ViewRecipeComponent implements OnInit {
  recipe: Recipe;
  navigateBack: boolean = false;
  mode: 'std'|'complex' = 'std';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private recipesService: RecipesService
  ) { }

  ngOnInit() {
    this.navigateBack = this.recipesService.navigationHelper.isOpenedFromList();
    this.recipesService.navigationHelper.resetOpenedFromList();

    var recipeId;
    if (this.route.snapshot.paramMap.get('id')) {
      recipeId = this.route.snapshot.paramMap.get('id') || '-1';
    } else {
      recipeId = '-1';
    }


    this.recipesService.getRecipeById(recipeId).subscribe({
      next: (recipe: Recipe) => {
        this.recipe = recipe;
        if(recipe.subRecipes && recipe.subRecipes.length > 0 ){
          this.mode = 'complex';
        } else{
          this.mode = 'std';
        }
      },
      error: (error) => {
        console.error('Error fetching recipe:', error);        
      }
    });
  }

  goBack(): void {
    if(this.navigateBack){
      this.location.back();
    } else{
      this.router.navigate(['/recipes/list']); // Navigate to /recipes/list
    }
  }
}
