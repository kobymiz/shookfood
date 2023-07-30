import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ConfigData, MenuIngredient, MenuItem } from '../menu.data-model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private databaseURL = 'assets/database';
  private DBNames = {
    config: 'config.json',
    menuItems: 'menu-items.json',
    ingredients: 'ingredients.json'
  }

  private config: ConfigData;
  private menuItems: MenuItem[];
  private ingredients: MenuIngredient[];

  constructor(private http: HttpClient) {
  }

  getItems() : Observable<MenuItem[]> {
    if(this.menuItems){
      return of(this.menuItems);
    } else{
      return this.http.get<any>(`${this.databaseURL}/${this.DBNames.menuItems}`).pipe(tap(data=>{
        console.log("Menu Items database loaded");
        this.menuItems = data;
      }), catchError(error => {
        console.error('Error loading menu items:', error);
        this.menuItems = [];
        return [];
      }));
    }
  }

  getIngredients(): Observable<MenuIngredient[]>{
    if(this.ingredients == undefined){
      return this.http.get<MenuIngredient[]>(`${this.databaseURL}/${this.DBNames.ingredients}`)
      .pipe(
        tap(response=>{
          console.log("Ingredients loaded: ", response);
          this.ingredients = response
          return response;
        }),
        catchError(error => {
          console.error('Error loading ingredients.json:', error);
          return []
        })
      );
    } else{
      return of(this.ingredients);
    }
  }

  getConfigData(): Observable<ConfigData> {
    if(this.config == undefined){
      return this.http.get<ConfigData>(`${this.databaseURL}/${this.DBNames.config}`)
      .pipe(
        tap(response=>{
          console.log("Config data loaded: ", response);
          this.config = response
          return response;
        }),
        catchError(error => {
          console.error('Error loading config.json:', error);
          return []
        })
      );
    } else{
      return of(this.config);
    }
  }

}
