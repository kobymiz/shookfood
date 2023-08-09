import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { IngredientCatalogItem, MenuIngredient, MenuItem } from '../../menu.data-model';
import { MenuService } from '../menu.service';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Observable, OperatorFunction } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './upsert-menu-item.component.html',
})
export class UpsertMenuItemComponent implements OnInit {
  menuItemForm!: FormGroup;
  categories: string[] = [];
  ingredientsCatalog: IngredientCatalogItem[] = [];

  allRecipes: any[] = [];
  saving: boolean = false;
  saveSuccess: boolean = false;
  saveError: boolean = false;

  @ViewChild('newIngredientsModalTemplate')
  newIngredientsModalTemplate;

  newIngredientsForm: FormGroup;
  updateIngredientsCatalogError = false;

  constructor(private fb: FormBuilder,
    private menuService: MenuService,
    private modalService: NgbModal) { }

  ngOnInit() {
    var items$ = this.menuService.getItems();
    var categories$ = this.menuService.getConfigData('menuCategories');
    var ingredientsCatalog$ = this.menuService.getIngredients();

    combineLatest([items$, categories$, ingredientsCatalog$]).subscribe({
      next: ([items, categories, ingredientsCatalog]) => {
        console.log("Items: ", items);
        console.log("Config: ", categories);
        console.log("ingredients: ", ingredientsCatalog);
        this.categories = categories;
        this.allRecipes = items;
        this.ingredientsCatalog = [...this.ingredientsCatalog, ...ingredientsCatalog];
      },
      error: (error) => {
        console.log("Error occured: ", error);
        this.allRecipes = [];
        this.categories = [];
        this.ingredientsCatalog = []
      }
    });

    this.menuItemForm = this.fb.group({
      name: ['', Validators.required],
      category: [null, Validators.required], // Use null as the initial value for the dropdown
      ingredients: this.fb.array([this.createIngredient()]), // Initial ingredient form control
    });
  }

  onSelectRecipe(event: any) {
    // Access the selected value from the event object
    const selectedRecipeName = event.target.value;
    if (!selectedRecipeName) {
      this.resetRecipeFormData();
      return;
    }

    var recipe = this.allRecipes.find(r => r.name == selectedRecipeName);

    if (recipe) {
      this.setRecipeFormDataFromExistingRecipe(recipe);
    } else {
      this.resetRecipeFormData();
    }

  }

  private resetRecipeFormData() {
    this.menuItemForm.reset();
    this.addIngredient();
  }

  private setRecipeFormDataFromExistingRecipe(recipe: MenuItem) {
    console.log("Set recipe Form from recipe: ", recipe);
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

    this.menuItemForm.patchValue({
      name: recipe.name,
      ingredients: recipe.ingredients.map(ingr=>{return {ingredient: {name:ingr.name, department: ingr.department}, ...ingr}}),
      category: recipe.category
    });
  }

  // Convenience getter for easy access to form controls
  get f() {
    return this.menuItemForm.controls;
  }

  get ingredients() {
    return this.menuItemForm.get('ingredients') as FormArray;
  }

  get newIngredients(){
    return this.newIngredientsForm.get('ingredients') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      ingredient: [null, Validators.required],
      unit: ['', Validators.required],
      quantity: [0, Validators.required],
      department: ['', Validators.required]
    });
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSubmit(skipNewIngredients = false) {
    if (this.menuItemForm.valid) {
      console.log("Form is not valid");
      return;
    }

    const formData = this.menuItemForm.value;

    const menuItem: MenuItem = {
      name: formData.name,
      category: formData.category,
      buyer: '',
      ingredients: formData.ingredients.map(ingr => { return { name: typeof (ingr.ingredient) == "string" ? ingr.ingredient : ingr.ingredient.name, unit: ingr.unit, quantity: ingr.quantity }; })
    };
    console.log("Upserting MenuItem: ", menuItem);

    if(!skipNewIngredients){
      var newIngrediants = this.getNewIngrediants(menuItem.ingredients);
      if (newIngrediants.length > 0) {
        return this.handleNewIngredients(newIngrediants)
      }
    }

    this.saving = true;
    this.menuService.upsertMenuItem(menuItem).subscribe({
      next: (response) => {
        this.saving = false;
        this.saveSuccess = true;
        this.saveError = false;
        console.log("Menu Item save response: ", response);
      },
      error: (err) => {
        this.saving = false;
        this.saveError = true;
        this.saveSuccess = false;
        console.log("Error saving menu item: ", err);
      }
    });
  }

  updateIngredientsCatalog() {
    this.saving = true;
    const newIngredients = this.newIngredientsForm.value.ingredients;
    console.log("Upserting new ingredients: ", newIngredients);
    this.menuService.upsertIngredientsCatalog(newIngredients).subscribe(success=>{
      this.saving = false;
      if(success){
        this.modalService.dismissAll();
        this.onSubmit(true);
      } else{
        this.updateIngredientsCatalogError = true;
      }
    });
  }

  skipUpdateIngredientsCatalog() {
    this.saving = false;
    this.modalService.dismissAll();
    this.onSubmit(true);
  }

  private getNewIngrediants(allIngrediants: MenuIngredient[]) {
    return allIngrediants.filter(ingr => this.ingredientsCatalog.findIndex(ici => ici.name == ingr.name) < 0);
  }

  private handleNewIngredients(ingredients) {
    this.newIngredientsForm = this.fb.group({
      ingredients: this.fb.array(
        ingredients.map(ingr=>this.fb.group({
          name: [ingr.name, Validators.required],
          department: ['', Validators.required]
        }))
      )
    });

    console.log("Ingredients Form:", this.newIngredientsForm.value);
    this.modalService.open(this.newIngredientsModalTemplate, { centered: true });
  }

  searchFormatter = (result: MenuIngredient) => `${result.name} | ${result.department}`;
  displayFormatter = (result: MenuIngredient) => result.name;

  search: OperatorFunction<string, readonly IngredientCatalogItem[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2 ? [] : this.ingredientsCatalog.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );
}
