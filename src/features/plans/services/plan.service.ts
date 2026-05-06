import { api } from '@/lib/api-client'
import type { WeekPlan, PlanMeal, UpdateMealInput } from '../types'

export const planService = {
  getCurrent: () => api.get<WeekPlan>('/plans/current'),
  generate: (weekPlanId: string) => api.post<WeekPlan>('/plans/generate', { weekPlanId }),
  refresh: (weekPlanId: string) => api.post<WeekPlan>('/plans/refresh', { weekPlanId }),
  updateMeal: (mealId: string, data: UpdateMealInput) =>
    api.put<PlanMeal>(`/plans/meals/${mealId}`, data),
  swapMeal: (mealId: string) => api.post<PlanMeal>(`/plans/meals/${mealId}/swap`, {}),
  deleteMeal: (mealId: string) => api.delete<void>(`/plans/meals/${mealId}`),
}
