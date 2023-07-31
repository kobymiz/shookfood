import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ConfigData, MenuIngredient, MenuItem } from '../menu.data-model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiURL = 'https://st8srdg94j.execute-api.eu-west-1.amazonaws.com/default';
  private apiendpoints = {
    config: 'config',
    menuItems: 'menuitem',
    ingredients: 'ingredientscatalog'
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
      return this.http.get<any>(`${this.apiURL}/${this.apiendpoints.menuItems}`).pipe(map(response=>{
        console.log("Menu Items database loaded: ", response);
        this.menuItems = response.data;
        return response.data;
      }), catchError(error => {
        console.error('Error loading menu items:', error);
        this.menuItems = [];
        return [];
      }));
    }
  }

  getIngredients(): Observable<MenuIngredient[]>{
    if(this.ingredients == undefined){
      return this.http.get<any>(`${this.apiURL}/${this.apiendpoints.ingredients}`)
      .pipe(
        map(response=>{
          console.log("Ingredients loaded: ", response);
          this.ingredients = response.data
          return response.data;
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

  getConfigData(key): Observable<any> {
    if(this.config == undefined){
      return this.http.get<any>(`${this.apiURL}/${this.apiendpoints.config}?key=${key}`)
      .pipe(
        map(response=>{
          console.log("Config data loaded: ", response);
          return response.data;
        }),
        catchError(error => {
          console.error('Error loading config.json:', error);
          return []
        })
      );
    } else{
      return of(undefined);
    }
  }

  upsertMenuItem(menuItem: MenuItem):Observable<boolean> {
    return this.http.post<any>(`${this.apiURL}/${this.apiendpoints.menuItems}`, menuItem).pipe(
      map(response=>{
        if(response.status == 0){
          console.log("Save item success: ", response);
          return true;
        }
        console.log("Error saving item: ", response);
        return false
      }),
      catchError(error => {
        console.error('Error saving item:', error);
        return []
      })
    )
  }
}
