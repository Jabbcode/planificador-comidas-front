export interface ShoppingItem {
  ingredientId: string
  name: string
  totalQuantity: number | null
  unit: string | null
  category: string
}

export interface ShoppingCategory {
  category: string
  items: ShoppingItem[]
}
