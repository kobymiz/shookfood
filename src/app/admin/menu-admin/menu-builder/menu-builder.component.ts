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
  menus: Menu[] = [];
  downloading: boolean;

  constructor(private fb: FormBuilder,
    private menuService: MenuService,
    private downloadService: DownloadService) {}

  ngOnInit() {
    var items$ = this.menuService.getItems();
    var categories$ = this.menuService.getConfigData('menuCategories');
    var ingredients$ = this.menuService.getIngredients();
    var buyers$ = this.menuService.getConfigData("buyers");
    var menus$ = this.menuService.getMenus();

    combineLatest([items$, categories$, ingredients$, buyers$, menus$]).subscribe({
      next: ([items, categories, ingredients, buyers,menus])=>{
        console.log("Items: ", items);
        this.createMenuSelection(items);
        this.categories = categories;
        this.ingredientsCatalog = ingredients;
        this.buyers = buyers;
        this.menus = menus;        
      },
      error: (error)=>{
        console.log("Error occured: ", error);
        this.allItems = [];
        this.categories = [];
      }
    });

    this.menuForm = this.fb.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
      adultGuests: [10, Validators.required],
      childGuests: [2, Validators.required],
      items: [[], Validators.required]      
    });
  }

  onSelectMenu(event){
    // Access the selected value from the event object
    const selectedMenu = event.target.value;
    if (!selectedMenu) {
      this.resetMenuFormData();
      return;
    }

    var menu = this.menus.find(m => m.eventName + ' | ' + m.eventDate == selectedMenu);

    if (menu) {
      this.setMenuFormData(menu);
    } else {
      this.resetMenuFormData();
    }
  }
  
  private setMenuFormData(menu: Menu) {
    console.log("Set mene Form: ", menu);
    
    this.menuForm.patchValue({
      eventName: menu.eventName,
      eventDate: menu.eventDate,
      childGuests: menu.childGuests,
      adultGuests: menu.adultGuests,      
      items: menu.items
    });
    this.shoppingList = {
      items: [...menu.shoppingList.items]
    };
    
    // Remove items from main menu
    menu.items.forEach(cat=>{   
      var category = this.allItems.find(c=>c.name==cat.name);
      cat.items.forEach(item=>{        
        var index = category.items.findIndex(it=>it.name===item.name);        
        category.items.splice(index, 1);
      });
    });    
  }

  private resetMenuFormData() {
    // Add items to main menu
    this.itemsArray.forEach(cat=>{   
      var category = this.allItems.find(c=>c.name==cat.name);
      cat.items.forEach(item=>{        
        category.items.push(item);
      });
    });

    this.menuForm.reset();    
    this.shoppingList.items = []
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
    if (!this.menuForm.valid) {
      console.log("Form is not valid");
      return;
    }

    const formData = this.menuForm.value;
      const menu: Menu = {
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        adultGuests: formData.adultGuests,
        childGuests: formData.childGuests,
        items: formData.items,
        shoppingList: this.shoppingList
      };
      console.log("Upserting Menu: ", menu);

      this.saving = true;
      this.menuService.upsertMenu(menu).subscribe({
        next: (response)=>{
          this.saving = false;
          this.saveSuccess = true;
          this.saveError = false;
          console.log("Menu save response: ", response);
        },
        error:(err)=>{
          this.saving = false;
          this.saveError = true;
          this.saveSuccess = false;
          console.log("Error saving menu: ", err);
        }
      });
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
    this.downloading = true;
    try{
      var formData = this.menuForm.value;
      this.downloadService.downloadExcel(this.shoppingListTable.nativeElement, "רשימת קניות", `${formData.name ||'שם אירוע'}-${formData.eventDate || 'תאריך'}.רשימת קניות`);
      this.downloading = false;
    } catch(err){
      console.log("Error downloading file...", err);
      this.downloading = false;
    }
    
    
  }
}
