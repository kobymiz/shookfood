import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Menu, MenuItem, ShoppingList } from '../../menu.data-model';
import { MenuService } from '../menu.service';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Observable, OperatorFunction } from 'rxjs';

@Component({
  selector: 'app-menu-builder',
  templateUrl: './menu-builder.component.html',
})
export class MenuBuilderComponent implements OnInit {
  menuForm!: FormGroup;

  allItems: any[] = [];
  categories:string[] = [];
  shoppingList: ShoppingList = {
    items: []
  }

  saving: boolean = false;
  saveSuccess: boolean = false;
  saveError: boolean = false;

  constructor(private fb: FormBuilder,
    private menuService: MenuService) {}

  ngOnInit() {
    var items$ = this.menuService.getItems();
    var categories$ = this.menuService.getConfigData('menuCategories');

    combineLatest([items$, categories$]).subscribe({
      next: ([items, categories])=>{
        console.log("Items: ", items);
        this.createMenuSelection(items);
        this.categories = categories;
      },
      error: (error)=>{
        console.log("Error occured: ", error);
        this.allItems = [];
        this.categories = [];
      }
    });

    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      eventDate: [new Date(), Validators.required],
      guests: [10, Validators.required],
      items: [[], Validators.required],
      shoppingList: this.fb.array([]),
    });
  }

  get itemsArray(){
    return (this.menuForm.get('items') as FormControl).value;
  }

  initializeItemsArray(initialValue){
    (this.menuForm.get('items') as FormControl).patchValue(initialValue);
  }

  onSelectItem(category, data: MenuItem) {
    // Add item to the form
    this.itemsArray.find(cat=>cat.name ===category.name).items.push(data);

    // Remove item from the main menu
    var index = category.items.findIndex(it=>it.name===data.name);
    category.items.splice(index, 1);
  }

  onRemoveItem(category, data: MenuItem){
    // Remove item from the form
    this.allItems.find(cat=>cat.name ===category.name).items.push(data);

    // Remove item from the main menu
    var index = category.items.findIndex(it=>it.name===data.name);
    category.items.splice(index, 1);
  }

  buildShoppingList(){
    var qtyFactor = this.menuForm.value.guests / 10;

    this.shoppingList.items = [];

    this.itemsArray.forEach(category=>{
      category.items.forEach(item=>{
        item.ingredients.forEach(ingr=>{
          var slItem = this.shoppingList.items.find(it=>it.name===ingr.name);
          if(!slItem){
            slItem = {
              buyer: '',
              comments: '',
              department: ingr.department,
              name: ingr.name,
              quantity: 0,
              unit: ingr.unit
            }
          }

          this.shoppingList.items.push(slItem);
          slItem.quantity += (ingr.quantity * qtyFactor);
          if(slItem.comments.length > 0){
            slItem.comments += `, ${item.name}`;
          } else{
            slItem.comments += `${item.name}`;
          }
        })
      })
    });
  }

  onSubmit() {
    if (this.menuForm.valid) {
      console.log("Form is not valid");
      return;
    }

    const formData = this.menuForm.value;
      const menu: Menu = {
        name: formData.name,
        eventDate: formData.eventDate,
        guests: formData.guests,
        items: formData.items,
        shoppingList: this.shoppingList
      };
      console.log("Upserting MenuItem: ", menu);

      this.saving = true;
      // this.menuService.upsertMenu(menu).subscribe({
      //   next: (response)=>{
      //     this.saving = false;
      //     this.saveSuccess = true;
      //     this.saveError = false;
      //     console.log("Menu Item save response: ", response);
      //   },
      //   error:(err)=>{
      //     this.saving = false;
      //     this.saveError = true;
      //     this.saveSuccess = false;
      //     console.log("Error saving menu item: ", err);
      //   }
      // });
  }

  private createMenuSelection(menuItems){
    const colorsClasses = ['btn-primary', 'btn-secondary', 'btn-warning', 'btn-dark', 'btn-success'];

    var sortedItems = menuItems.sort((a,b)=>{a.category + a.name > b.category + a.name ? 1 :  (a.category + a.name < b.category + a.name ? -1 : 0)});
    var categories = [...new Set(sortedItems.map(mi=>mi.category))];

    this.allItems = categories.map((cat, index)=>{
      return {
        name: cat,
        colorClass: colorsClasses[index % colorsClasses.length],
        items: menuItems.filter(mi=>mi.category===cat)
      }
    });

    var selectedItems = this.allItems.map(category=>{
      return {
        ...category,
        items: []
      }
    });
    this.initializeItemsArray(selectedItems);

    console.log("All items: ", this.allItems);

  }
}
