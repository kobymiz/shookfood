import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Recipe, Ingredient } from '../data-model/recipes-data-model';
import { RecipesService } from '../recipes.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './upsert-recipe.component.html',
})
export class UpsertRecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  categories:any[] = [];

  allRecipes: any[] = [];
  saving: boolean = false;
  saveSuccess: boolean = false;
  saveError: boolean = false;

  constructor(private fb: FormBuilder,
    private recipesService: RecipesService,
    private authService: AuthService) {}

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
      id: [''],
      recipe_name: ['', Validators.required],
      description: ['', Validators.required],
      category_id: [null, Validators.required], // Use null as the initial value for the dropdown
      ingredients: this.fb.array([this.createIngredient()]), // Initial ingredient form control
      image: '',
      instructions: this.fb.array([new FormControl('', Validators.required)])
    });
  }

  validateAndExtractToken(): void {

  }

  onSelectRecipe(event: any) {
    // Access the selected value from the event object
    const selectedRecipeId = event.target.value;
    if(!selectedRecipeId){
      this.resetRecipeFormData();
      return;
    }

    this.recipesService.getRecipeById(selectedRecipeId).subscribe({
      next: (recipe=>{
        console.log("Selected Recipe", recipe);

        // If a recipe is selected, update the form values with the selected recipe data
        if (recipe) {
          this.setRecipeFormDataFromExistingRecipe(recipe);
        } else {
          this.resetRecipeFormData();
        }
      })
    });
  }

  private resetRecipeFormData() {
    this.recipeForm.reset();

    this.instructions.clear();
    this.ingredients.clear();

    this.addInstruction();
    this.addIngredient();

  }

  private setRecipeFormDataFromExistingRecipe(recipe: Recipe) {
    //Ensure Instructions form contains the right number of elements
    if (recipe.instructions.length < this.instructions.length) {
      const numElementsToAdd = this.instructions.length - recipe.instructions.length;
      for (let i = 0; i < numElementsToAdd; i++) {
        this.instructions.removeAt(0); // Remove elements from the beginning of the array
      }
    } else if (recipe.instructions.length > this.instructions.length) {
      const numElementsToAdd = recipe.instructions.length - this.instructions.length;
      for (let i = 0; i < numElementsToAdd; i++) {
        this.addInstruction();
      }
    }

    //Ensure ingredients form contains the right number of elements
    if (recipe.ingredients.length < this.ingredients.length) {
      const numElementsToAdd = this.ingredients.length - recipe.ingredients.length;
      for (let i = 0; i < numElementsToAdd; i++) {
        this.ingredients.removeAt(0); // Remove elements from the beginning of the array
      }
    } else if (recipe.ingredients.length > this.ingredients.length) {
      const numElementsToAdd = recipe.ingredients.length - this.ingredients.length;
      for (let i = 0; i < numElementsToAdd; i++) {
        this.addIngredient();
      }
    }

    this.recipeForm.patchValue({
      recipe_name: recipe.recipe_name,
      description: recipe.description,
      id: recipe.id,
      image: recipe.image,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      category_id: recipe.category_id
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
        id: formData.id || '',
        recipe_name: formData.recipe_name,
        description: formData.description,
        category_id: formData.category_id,
        ingredients: formData.ingredients,
        image: formData.image,
        instructions: formData.instructions
      };
      console.log("Upserting Recipe: ", recipe);

      this.saving = true;
      this.recipesService.upsertRecipe(recipe).subscribe({
        next: (response)=>{
          this.saving = false;
          this.saveSuccess = true;
          this.saveError = false;
          console.log("Recipe save response: ", response);
        },
        error:(err)=>{
          this.saving = false;
          this.saveError = true;
          this.saveSuccess = false;
          console.log("Error saving recipe: ", err);
        }
      });
    }
  }  
}
