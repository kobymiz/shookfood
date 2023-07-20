export interface Recipe {
  id: string;
  recipe_name: string;
  description: string;
  category_id: string;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface Ingredient {
  name: string;
  units: string;
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
