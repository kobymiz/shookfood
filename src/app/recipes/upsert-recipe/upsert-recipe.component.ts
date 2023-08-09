import { SubRecipe } from './../data-model/recipes-data-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Recipe } from '../data-model/recipes-data-model';
import { RecipesService } from '../recipes.service';
// TODO: Check if recipe saves correctly
// TODO: Update ViewRecipe to support SubRecipes

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
  mode: 'std' | 'complex' = 'std';

  constructor(private fb: FormBuilder,
    private recipesService: RecipesService) {}

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
      image: '',
      ingredients: this.fb.array([this.createIngredient()]), // Initial ingredient form control      
      instructions: this.fb.array([new FormControl('')]),
      subRecipes: this.fb.array([this.createSubRecipe()])
    });
  }

  validateAndExtractToken(): void {

  }

  onSelectRecipeType(event: any){
    this.mode = event.target.value;
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
    this.mode = 'std';
    this.recipeForm.reset();
    
    this.subRecipes.clear();
    this.instructions.clear();
    this.ingredients.clear();

    this.addInstruction();
    this.addIngredient();
  }

  private setRecipeFormDataFromExistingRecipe(recipe: Recipe) {
    this.mode = recipe.subRecipes && recipe.subRecipes.length > 0 ? 'complex' : 'std';
        
    this.alignFormArrayLength(recipe.instructions, this.instructions, ()=>{this.addInstruction()});
    this.alignFormArrayLength(recipe.ingredients, this.ingredients, ()=>{this.addIngredient()});        

    this.recipeForm.patchValue({
      recipe_name: recipe.recipe_name,
      description: recipe.description,
      id: recipe.id,
      image: recipe.image,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      category_id: recipe.category_id
    });
    
    if(recipe.subRecipes && recipe.subRecipes.length >0){
      this.alignFormArrayLength(recipe.subRecipes, this.subRecipes, ()=>{this.addSubRecipe()});
      recipe.subRecipes.forEach((sr, index)=>{
        var formSubRecipe = this.subRecipes.controls[index];        
        this.alignFormArrayLength(sr.ingredients, this.srIngredients(formSubRecipe), ()=>{this.addSubIngredient(formSubRecipe)});
        this.alignFormArrayLength(sr.instructions, this.srInstructions(formSubRecipe), ()=>{this.addSubInstruction(formSubRecipe)});        
        formSubRecipe.patchValue({
          name: sr.name,
          ingredients: sr.ingredients,
          instructions: sr.instructions
        })
      });      
    }
  }

  private alignFormArrayLength(itemsArray: any[], formArray: FormArray, additemsCallback: any){
    if (itemsArray.length < formArray.length) {
      const numElementsToAdd = formArray.length - itemsArray.length;
      for (let i = 0; i < numElementsToAdd; i++) {
        formArray.removeAt(0); // Remove elements from the beginning of the array
      }
    } else if (itemsArray.length > formArray.length) {
      const numElementsToAdd = itemsArray.length - formArray.length;
      for (let i = 0; i < numElementsToAdd; i++) {
        additemsCallback();
      }
    }    
  }

  // Convenience getter for easy access to form controls
  get f() {
    return this.recipeForm.controls;
  }

  srIngredients(subr){
    return subr.get('ingredients') as FormArray;
  }
  srInstructions(subr){
    return subr.get('instructions') as FormArray;
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  get subRecipes() {
    return this.recipeForm.get('subRecipes') as FormArray;
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

  addSubIngredient(subr) {
    this.srIngredients(subr).push(this.createIngredient());
  }

  removeSubIngredient(subr, index: number) {
    this.srIngredients(subr).removeAt(index);
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

  addSubInstruction(subr) {
    this.srInstructions(subr).push(new FormControl('', Validators.required));
  }

  removeSubInstruction(subr, index: number) {
    this.srInstructions(subr).removeAt(index);
  }

  createSubRecipe(): FormGroup {
    return this.fb.group({      
      name: ['', Validators.required],      
      ingredients: this.fb.array([this.createIngredient()]),
      instructions: this.fb.array([new FormControl('', Validators.required)]),      
    });
  }

  addSubRecipe() {
    this.subRecipes.push(this.createSubRecipe());
  }

  removeSubRecipe(index: number) {
    this.subRecipes.removeAt(index);
  }

  onSubmit() {    
    if(this.mode == 'complex'){
      this.instructions.clear();
      this.ingredients.clear();
    } else{
      this.subRecipes.clear();
    }

    console.log("Submitting Form: ", this.recipeForm);
    console.log("Valid: ", this.recipeForm.valid);
    if (this.recipeForm.valid) {
      const formData = this.recipeForm.value;
      const recipe: Recipe = {
        id: formData.id || '',
        recipe_name: formData.recipe_name,
        description: formData.description,
        category_id: formData.category_id,
        ingredients: formData.ingredients,
        image: formData.image,
        instructions: formData.instructions,
        subRecipes: formData.subRecipes
      };

      if(this.mode == 'std'){
        recipe.subRecipes = [];
      } else {
        recipe.instructions = [];
        recipe.ingredients = [];
      }

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
