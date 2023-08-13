import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IngredientCatalogItem } from '../../menu.data-model';
import { MenuService } from '../menu.service';
import{DownloadService} from '../../../download.service';
import { combineLatest} from 'rxjs';

@Component({
  selector: 'app-ingredients-catalog',
  templateUrl: './ingredients-catalog.component.html',
})
export class IngredientsCatalogComponent implements OnInit {    
  
  items: {status: 'new'|'edit'|'delete'|'', mode:'edit'|'view'|'adding', item: IngredientCatalogItem}[] = [];    
  editItem: {status: 'new'|'edit'|'delete'|'', mode:'edit'|'view'|'adding', item: IngredientCatalogItem} | undefined = undefined;

  saving = false;
  saveSuccess=false;
  saveError = false;

  constructor(private menuService: MenuService) {}

  ngOnInit() {    
    this.loadIngredients();    
  }  
  
  private loadIngredients() {
    var ingredients$ = this.menuService.getIngredients();

    combineLatest([ingredients$]).subscribe({
      next: ([ingredients]) => {
        console.log("ingredients: ", ingredients);
        this.items = ingredients.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0).map(ing => {
          return {
            status: '',
            mode: 'view',
            item: ing
          };
        });
      },
      error: (error) => {
        console.log("Error occured: ", error);
        this.items = [];
      }
    });
  }

  addNewIngredient() {
    if(this.editItem && this.editItem.status=='new'){
      return;
    }

    this.editItem = {status: 'new', mode: 'adding', item: {name: '', department: ''}};
    this.items.unshift({status: 'new', mode: 'adding', item: {name: '', department: ''}});
    
  }

  editIngredient(item){   
    if(this.editItem != undefined) {
      return;
    }

    if(item){
      this.editItem = {...item, item: {...item.item}};
      item.mode = 'edit';
    }
  }

  endEditIngredient(item){    
    if(item){
      item.item.name = this.editItem?.item.name;
      item.item.department = this.editItem?.item.department;
      item.mode = 'view';
      if(this.editItem?.status == 'new'){
        item.status = 'new'
      } else{
        item.status = 'edit'
      }            
    }

    this.editItem = undefined;
  }

  cancelEditIngredient(item){
    if(item){            
      if(this.editItem?.status=='new'){
        this.items.shift();
      } else{
        item.mode = 'view';      
        item.status = this.editItem?.status;      
      }      
    }

    this.editItem = undefined;
  }
  cancelAddItem(){
    this.items.shift();
    this.editItem = undefined;
  }

  removeIngredient(item){        
    if(this.editItem != undefined){      
      return;
    }

    if(item){
      if(item.status == 'new'){
        var itemIndex = this.items.findIndex(it=>it==item);
        if(itemIndex>-1){
          this.items.splice(itemIndex, 1);
        }
      } else{
        item.status = 'delete';
      }
      
    }
  }

  undoRemoveIngredient(item){
    if(item){
      item.status = '';
    }
  }

  get hasChanges() {
    return this.items.filter(it=>it.status != '').length > 0;
  }

  onSubmit() {

    if(!this.hasChanges){
      console.log("No changes made...");
      return;
    }      

      this.saving = true;

      var upsertItems = this.items.filter(it=>it.status ==='edit' || it.status==='new').map(it=>it.item);
      var deleteItems = this.items.filter(it=>it.status ==='delete').map(it=>it.item);

      var upsert$ = this.menuService.upsertIngredientsCatalog(upsertItems);
      var delete$ = this.menuService.deleteIngredientsCatalog(deleteItems);

      combineLatest([upsert$, delete$]).subscribe({
        next: ([upsertRes, deleteRes])=>{
          console.log("{upsertRes, deleteRes}: ", {upsertRes, deleteRes});        
          this.saving = false;
          this.saveSuccess = (upsertRes && deleteRes); 
          this.saveError = !(upsertRes && deleteRes);          
        },
        error: (error)=>{
          console.log("Error occured: ", error);
          this.saving = false;
          this.saveSuccess = false;
          this.saveError = true;
          console.log("Error saving menu: ", error);
        }
      });             
  }
}
