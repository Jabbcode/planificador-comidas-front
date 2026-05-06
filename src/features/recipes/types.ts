export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER'

export interface RecipeIngredient {
  id: string
  quantity: number | null
  unit: string | null
  ingredient: {
    id: string
    name: string
    category: string | null
    preference: string
  }
}

export interface Recipe {
  id: string
  name: string
  mealType: MealType
  description: string | null
  instructions: string | null
  prepTime: number | null
  calories: number | null
  servings: number | null
  imageUrl: string | null
  aiGenerated: boolean
  createdAt: string
  ingredients: RecipeIngredient[]
}

export interface CreateRecipeIngredientInput {
  name: string
  quantity?: number | null
  unit?: string | null
  category?: string | null
}

export interface CreateRecipeInput {
  name: string
  mealType: MealType
  description?: string
  instructions?: string
  prepTime?: number
  calories?: number
  servings?: number
  imageUrl?: string
  ingredients?: CreateRecipeIngredientInput[]
}

export type UpdateRecipeInput = Partial<CreateRecipeInput>

export interface GenerateRecipeInput {
  mealType: MealType
  extraConstraints?: string
}
