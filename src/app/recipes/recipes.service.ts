import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, Recipe } from './data-model/recipes-data-model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  upsertRecipe(recipe: Recipe) {
    if(!recipe.id){
      recipe.id = uuidv4();
    }
    const url = `${this.apiURL}/item`;
    return this.http.post(url, recipe);
  }
  private apiURL = "https://ele8bii9tf.execute-api.eu-west-1.amazonaws.com/default";

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.apiURL + "/list");
  }

  getRecipeById(id: string): Observable<Recipe> {
    const url = `${this.apiURL}/item?recipeId=${id}`;
    return this.http.get<Recipe>(url);
  }
}
