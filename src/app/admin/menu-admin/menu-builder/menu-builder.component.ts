import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IngredientCatalogItem, Menu, MenuItem, ShoppingList } from '../../menu.data-model';
import { MenuService } from '../menu.service';
import{DownloadService} from '../../../download.service';
import { combineLatest} from 'rxjs';

@Component({
  selector: 'app-menu-builder',
  templateUrl: './menu-builder.component.html',
})
export class MenuBuilderComponent implements OnInit {
  @ViewChild('shoppingListTable', { static: false }) shoppingListTable: ElementRef;

  menuForm!: FormGroup;

  allItems: any[] = [];
  categories:string[] = [];
  shoppingList: ShoppingList = {
    items: []
  }

  saving: boolean = false;
  saveSuccess: boolean = false;
  saveError: boolean = false;
  ingredientsCatalog: IngredientCatalogItem[];
  buyers: string[] = [];

  constructor(private fb: FormBuilder,
    private menuService: MenuService,
    private downloadService: DownloadService) {}

  ngOnInit() {
    var items$ = this.menuService.getItems();
    var categories$ = this.menuService.getConfigData('menuCategories');
    var ingredients$ = this.menuService.getIngredients();
    var buyers$ = this.menuService.getConfigData("buyers");

    combineLatest([items$, categories$, ingredients$, buyers$]).subscribe({
      next: ([items, categories, ingredients, buyers])=>{
        console.log("Items: ", items);
        this.createMenuSelection(items);
        this.categories = categories;
        this.ingredientsCatalog = ingredients;
        this.buyers = buyers;
        console.log("Buyers: ", this.buyers);
      },
      error: (error)=>{
        console.log("Error occured: ", error);
        this.allItems = [];
        this.categories = [];
      }
    });

    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      eventDate: ['', Validators.required],
      adultGuests: [10, Validators.required],
      childGuests: [2, Validators.required],
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
    var qtyFactor = (this.menuForm.value.adultGuests+this.menuForm.value.childGuests*0.5) / 10;

    if(!this.shoppingList.items){
      this.shoppingList.items = [];
    } else if(this.shoppingList.items.length > 0){
      this.shoppingList.items = this.shoppingList.items.filter(sli=>sli.mode=='manual');
    }

    this.itemsArray.forEach(category=>{
      category.items.forEach(item=>{
        item.ingredients.forEach(ingr=>{
          var slItem = this.shoppingList.items.find(it=>it.name===ingr.name && it.buyer==item.buyer);
          var ici = this.ingredientsCatalog.find(it=>it.name === ingr.name) || {name:ingr.name, department: ingr.department};
          if(!slItem){
            slItem = {
              buyer: item.buyer,
              comments: '',
              department: ici.department || '-',
              name: ingr.name,
              quantity: 0,
              unit: ingr.unit,
              mode: 'auto'
            }
            this.shoppingList.items.push(slItem);
          }

          slItem.quantity += Math.round((ingr.quantity * qtyFactor));
          if(slItem.comments.length > 0){
            slItem.comments += `, ${item.name}`;
          } else{
            slItem.comments += `${item.name}`;
          }
        })
      })
    });

    this.shoppingList.items.sort((a,b)=>a.department+a.name > b.department+b.name ? 1 : (a.department+a.name < b.department+b.name ? -1:0))
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

  setMenuItemBuery(menuItem: MenuItem, buyer: string){
    menuItem.buyer = buyer;
  }

  addManulItemToShoppingList(){
    this.shoppingList.items.unshift({
      mode:'manual',
      buyer: '',
      unit: '',
      comments: '',
      department: '',
      name: '',
      quantity: 1
    });
  }

  downloadShoppingList(){
    this.downloadService.downloadExcel(this.shoppingListTable.nativeElement)
  }
}
