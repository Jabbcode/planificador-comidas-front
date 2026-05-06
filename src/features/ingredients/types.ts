export type Preference = 'LIKED' | 'DISLIKED' | 'NEUTRAL'

export interface Ingredient {
  id: string
  name: string
  category: string | null
  preference: Preference
  createdAt: string
}

export interface CreateIngredientInput {
  name: string
  category?: string
  preference?: Preference
}

export interface UpdateIngredientInput {
  name?: string
  category?: string
  preference?: Preference
}
