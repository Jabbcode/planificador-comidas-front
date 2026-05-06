import { api } from '@/lib/api-client'
import type { Recipe, CreateRecipeInput, UpdateRecipeInput, GenerateRecipeInput, MealType } from '../types'

export const recipeService = {
  getAll: (mealType?: MealType) => {
    const query = mealType ? `?mealType=${mealType}` : ''
    return api.get<Recipe[]>(`/recipes${query}`)
  },

  getById: (id: string) => api.get<Recipe>(`/recipes/${id}`),

  create: (data: CreateRecipeInput) => api.post<Recipe>('/recipes', data),

  update: (id: string, data: UpdateRecipeInput) => api.put<Recipe>(`/recipes/${id}`, data),

  remove: (id: string) => api.delete<void>(`/recipes/${id}`),

  generate: (data: GenerateRecipeInput) => api.post<Recipe>('/recipes/generate', data),
}
