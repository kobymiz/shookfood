import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Recipe, Ingredient } from '../data-model/recipes-data-model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './upsert-recipe.component.html',
})
export class UpsertRecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  categories:any[] = [];

  allRecipes: any[] = [];

  constructor(private fb: FormBuilder, private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesService.getRecipes().subscribe({
      next: (response) => {
        this.allRecipes = response.data.items;
        this.categories = response.data.categories;
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
        this.allRecipes = [];
        this.categories = [];
      }
    });

    this.recipeForm = this.fb.group({
      recipe_name: ['', Validators.required],
      description: ['', Validators.required],
      category_id: [null, Validators.required], // Use null as the initial value for the dropdown
      ingredients: this.fb.array([this.createIngredient()]), // Initial ingredient form control
      image: '',
      instructions: this.fb.array([new FormControl('', Validators.required)])
    });
  }

  onSelectRecipe(event: any) {
    // Access the selected value from the event object
    const selectedRecipeId = event.target.value;

    const selectedRecipe:Recipe = this.allRecipes.find(recipe => recipe.id === selectedRecipeId);
    this.recipesService.getRecipeById(selectedRecipeId).subscribe({
      next: (recipe=>{
        console.log("Selected Recipe", recipe);

        // If a recipe is selected, update the form values with the selected recipe data
        if (recipe) {
          this.recipeForm.patchValue({
            recipe_name: recipe.recipe_name,
            description: recipe.description,
            id: recipe.id,
            image: recipe.image,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            category_id: recipe.category_id
          });
        } else {
          // If "Select an existing recipe" option is chosen, reset the form
          this.recipeForm.reset();
        }
      })
    });
  }

  // Convenience getter for easy access to form controls
  get f() {
    return this.recipeForm.controls;
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      unit: ['', Validators.required],
      quantity: [0, Validators.required]
    });
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addInstruction() {
    this.instructions.push(new FormControl('', Validators.required));
  }

  removeInstruction(index: number) {
    this.instructions.removeAt(index);
  }
  castInstructionToFormControl(obj:any){
    return obj as FormControl;
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      const formData = this.recipeForm.value;
      const recipe: Recipe = {
        id: '', // Assuming the ID will be auto-generated by the backend
        recipe_name: formData.recipe_name,
        description: formData.description,
        category_id: formData.category_id,
        ingredients: formData.ingredients,
        image: formData.image,
        instructions: formData.instructions
      };
      console.log("Upserting Recipe: ", recipe);

      this.recipesService.upsertRecipe(recipe).subscribe({
        next: (response)=>{
          console.log("Recipe save response: ", response);
        },
        error:(err)=>{
          console.log("Error saving recipe: ", err);
        }
      });
    }
  }
}
