import { api } from '@/lib/api-client'
import type { Ingredient, CreateIngredientInput, UpdateIngredientInput, Preference } from '../types'

export const ingredientService = {
  getAll: (preference?: Preference) => {
    const query = preference ? `?preference=${preference}` : ''
    return api.get<Ingredient[]>(`/ingredients${query}`)
  },
  create: (data: CreateIngredientInput) =>
    api.post<Ingredient>('/ingredients', data),
  update: (id: string, data: UpdateIngredientInput) =>
    api.put<Ingredient>(`/ingredients/${id}`, data),
  remove: (id: string) =>
    api.delete<void>(`/ingredients/${id}`),
}
