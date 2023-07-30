export interface Recipe {
  id: string;
  recipe_name: string;
  description: string;
  category_id: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  subRecipes?: SubRecipe[]
}

export interface SubRecipe {  
  name: string;      
  ingredients: Ingredient[];
  instructions: string[];
}

export interface Ingredient {
  name: string;
  unit: string;
  quantity: number;
}

export interface Category{
  name: string;
  id: string;
}


export interface APIResponse{
  status: number;
  error?: any;
  data?: any;
}
