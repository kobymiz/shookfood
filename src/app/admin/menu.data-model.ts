export interface MenuItem{
  name: string
  category: string
  buyer: string
  ingredients: MenuIngredient[]
}

export interface MenuIngredient{
  name: string
  units: string
  quantity: number
  department: string
}

export interface IngredientCatalogItem{
  name: string
  department: string
}

export interface Menu {
  name: string
  eventDate: Date
  guests: number
  items: MenuItem[]
  shoppingList: ShoppingList
}

export interface ShoppingList{
  items: ShoppingListItem[]
}

export interface ShoppingListItem{
  name: string
  quantity: number
  unit: string
  buyer: string
  department: string
  comments: string,
  mode: 'manual' | 'auto'
}

export interface ConfigData {
  categories: string[]
  departments: string[]
}
