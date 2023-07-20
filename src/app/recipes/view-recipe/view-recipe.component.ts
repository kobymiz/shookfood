import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../data-model/recipes-data-model';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html'
})
export class ViewRecipeComponent implements OnInit {
  recipe: Recipe | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService
  ) { }

  ngOnInit() {
    var recipeId;
    if (this.route.snapshot.paramMap.get('id')) {
      recipeId = this.route.snapshot.paramMap.get('id') || '-1';
    } else {
      recipeId = '-1';
    }


    this.recipesService.getRecipeById(recipeId).subscribe({
      next: (recipe: Recipe) => {
        this.recipe = recipe;
      },
      error: (error) => {
        console.error('Error fetching recipe:', error);
        this.recipe = undefined;
      }
    });
  }
}
