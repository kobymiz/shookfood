export interface MenuItem{
  name: string
  category: string
  ingredients: MenuIngredient[]
}

export interface MenuIngredient{
  name: string
  units: string
  quantity: number
  department: string
}

export interface Menu {
  items: MenuItem[]
}

export interface ShoppingList{
  eventDate: Date,
  items: ShoppingListItem[]
}

export interface ShoppingListItem{
  name: string
  quantity: number
  unit: string
  buyer: string
  department: string
}

export interface ConfigData {
  categories: string[]
  departments: string[]
}
