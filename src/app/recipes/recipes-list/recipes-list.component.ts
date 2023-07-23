import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Category, Recipe } from '../data-model/recipes-data-model';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html', // Updated template URL
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];

  categories: any[] = [];
  selectedCategory: string | undefined = undefined;
  selectedRecipe: Recipe | undefined = undefined;

  constructor(private recipesService: RecipesService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the recipe list from the database
    const recipes$ = this.recipesService.getRecipes();
    const category$ = this.route.queryParams.pipe(
      map((params)=>params['category'])
    );

    combineLatest([category$, recipes$]).subscribe({
      next: ([category, recipes]) => {
        console.log("New data: ", {recipes, category});
        this.recipes = recipes.data.items;
        this.categories = recipes.data.categories;
        this.selectedCategory = category;
        this.filterByCategory();
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
        this.recipes = [];
        this.categories = [];
      }
    });
  }

  onViewRecipeClick(recipe: Recipe){
    this.recipesService.navigationHelper.setOpenedFromList();
  }

  filterByCategory(){
    console.log("Start filtering recieps: ", this.selectedCategory);
    if(this.selectedCategory === undefined){
      console.log("No category, showing all recipes");
      this.filteredRecipes = this.recipes;
      return;
    }

    this.filteredRecipes = this.recipes.filter(r=>r.category_id===this.selectedCategory);

    console.log("Recipes: ", this.filteredRecipes);
  }

  viewRecipe(recipe: Recipe){
    this.selectedRecipe = recipe;
  }
}
