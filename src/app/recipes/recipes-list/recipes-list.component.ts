import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../data-model/recipes-data-model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html', // Updated template URL
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesService.getRecipes().subscribe({
      next: (response) => {
        this.recipes = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
        this.recipes = [];
      }
    });
  }
}
