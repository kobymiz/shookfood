import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Category, Recipe } from '../data-model/recipes-data-model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html', // Updated template URL
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];

  categories: any[] = [];
  selectedCategory: Category | undefined = undefined;
  selectedRecipe: Recipe | undefined = undefined;

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesService.getRecipes().subscribe({
      next: (response) => {
        this.recipes = response.data.items;
        this.categories = response.data.categories;
        this.updateFilteredRecipes();
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
        this.recipes = [];
        this.categories = [];
      }
    });
  }

  filterByCategory(category: Category){
    if(this.selectedCategory === category){
      this.selectedCategory = undefined;
    } else{
      this.selectedCategory = category;
    }

    console.log("Filtering by Category", this.selectedCategory);
    this.updateFilteredRecipes();
  }

  updateFilteredRecipes() {
    if(this.selectedCategory === undefined){
      this.filteredRecipes = this.recipes;
      return;
    }
    var catId = this.selectedCategory.id;

    this.filteredRecipes = this.recipes.filter(r=>r.category_id===catId);
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    this.filteredRecipes.push({...this.filteredRecipes[0]});
    console.log("Recipes: ", this.filteredRecipes);
  }

  viewRecipe(recipe: Recipe){
    this.selectedRecipe = recipe;
  }
}
