import Link from 'next/link'
import { Coffee, Utensils, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MEAL_LABEL } from '@/features/recipes/constants'
import { formatDayShortES } from '@/lib/date'
import { todayDayOfWeek } from '@/lib/date'
import type { WeekPlan, PlanMeal } from '../types'

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER'

const MEAL_ICON = { BREAKFAST: Coffee, LUNCH: Utensils, DINNER: Moon }
const MEAL_BG: Record<MealType, string> = {
  BREAKFAST: 'bg-amber-100 text-amber-500',
  LUNCH: 'bg-green-100 text-green-600',
  DINNER: 'bg-indigo-100 text-indigo-500',
}
const MEAL_ORDER = ['BREAKFAST', 'LUNCH', 'DINNER']
const MEAL_CUTOFF_HOUR: Record<MealType, number> = {
  BREAKFAST: 12,
  LUNCH: 17,
  DINNER: 24,
}

function getUpcomingMeals(plan: WeekPlan, limit = 3): PlanMeal[] {
  const todayIndex = todayDayOfWeek()
  const currentHour = new Date().getHours()

  return plan.meals
    .filter(m => {
      if (m.dayOfWeek > todayIndex) return true
      if (m.dayOfWeek < todayIndex) return false
      return currentHour < MEAL_CUTOFF_HOUR[m.mealType as MealType]
    })
    .sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek
      return MEAL_ORDER.indexOf(a.mealType) - MEAL_ORDER.indexOf(b.mealType)
    })
    .slice(0, limit)
}

interface Props {
  plan: WeekPlan
}

export default function UpcomingMeals({ plan }: Props) {
  const meals = getUpcomingMeals(plan)

  if (meals.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-title-sm font-semibold text-on-surface">Próximas comidas</h2>
      <div className="flex flex-col gap-2">
        {meals.map(meal => {
          const Icon = MEAL_ICON[meal.mealType as MealType]
          return (
            <Link
              key={meal.id}
              href={`/recetas/${meal.recipe.id}`}
              className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-sm hover:bg-surface-container transition-colors"
            >
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', MEAL_BG[meal.mealType as MealType])}>
                <Icon size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-label-sm font-semibold text-on-surface-variant">
                  {formatDayShortES(meal.dayOfWeek)} · {MEAL_LABEL[meal.mealType as MealType]}
                </span>
                <span className="text-body-sm font-medium text-on-surface truncate">{meal.recipe.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
