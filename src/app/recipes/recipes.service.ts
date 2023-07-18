import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, Recipe } from './data-model/recipes-data-model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private apiURL = "https://ele8bii9tf.execute-api.eu-west-1.amazonaws.com/default";

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.apiURL + "/list");
  }

  getRecipeById(id: number): Observable<Recipe> {
    const url = `${this.apiURL}/item?recipeId=${id}`;
    return this.http.get<Recipe>(url);
  }
}
