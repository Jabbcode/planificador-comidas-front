import type { MealType } from './types'

export const MEAL_LABEL: Record<MealType, string> = {
  BREAKFAST: 'Desayuno',
  LUNCH: 'Almuerzo',
  DINNER: 'Cena',
}

export const MEAL_COLOR: Record<MealType, string> = {
  BREAKFAST: 'bg-amber-100 text-amber-700',
  LUNCH: 'bg-green-100 text-green-700',
  DINNER: 'bg-indigo-100 text-indigo-700',
}

export const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: 'BREAKFAST', label: 'Desayuno' },
  { value: 'LUNCH', label: 'Almuerzo' },
  { value: 'DINNER', label: 'Cena' },
]
