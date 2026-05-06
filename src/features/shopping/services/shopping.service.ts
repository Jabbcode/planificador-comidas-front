import { api } from '@/lib/api-client'
import type { ShoppingCategory } from '../types'

export const shoppingService = {
  getShoppingList: (weekPlanId: string) =>
    api.get<ShoppingCategory[]>(`/plans/${weekPlanId}/shopping-list`),
}
