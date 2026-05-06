import type { Recipe } from '../recipes/types'

export interface PlanMeal {
  id: string
  weekPlanId: string
  dayOfWeek: number // 0 = Monday, 6 = Sunday
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER'
  locked: boolean
  notes: string | null
  recipe: Recipe
}

export interface WeekPlan {
  id: string
  weekStart: string
  createdAt: string
  meals: PlanMeal[]
}

export interface UpdateMealInput {
  locked?: boolean
  recipeId?: string
  notes?: string | null
}
