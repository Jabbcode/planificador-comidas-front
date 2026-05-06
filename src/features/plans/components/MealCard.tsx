import Link from 'next/link'
import { Coffee, Utensils, Moon, Lock, Clock, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MEAL_LABEL } from '@/features/recipes/constants'
import type { PlanMeal } from '../types'

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER'

const MEAL_BG: Record<MealType, string> = {
  BREAKFAST: 'bg-amber-100',
  LUNCH: 'bg-green-100',
  DINNER: 'bg-indigo-100',
}

const MEAL_ICON_COLOR: Record<MealType, string> = {
  BREAKFAST: 'text-amber-500',
  LUNCH: 'text-green-600',
  DINNER: 'text-indigo-500',
}

const MEAL_ICON = {
  BREAKFAST: Coffee,
  LUNCH: Utensils,
  DINNER: Moon,
}

interface Props {
  meal: PlanMeal | undefined
  mealType: MealType
}

export default function MealCard({ meal, mealType }: Props) {
  const Icon = MEAL_ICON[mealType]

  return (
    <div className="rounded-2xl bg-surface shadow-sm overflow-hidden flex flex-col">
      <div className={cn('flex items-center justify-center h-28', MEAL_BG[mealType])}>
        <Icon size={40} className={cn('opacity-60', MEAL_ICON_COLOR[mealType])} />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className={cn(
            'rounded-full px-2.5 py-0.5 text-label-sm font-semibold',
            MEAL_BG[mealType],
            MEAL_ICON_COLOR[mealType]
          )}>
            {MEAL_LABEL[mealType]}
          </span>
          {meal?.locked && <Lock size={14} className="text-on-surface-variant" />}
        </div>

        {meal ? (
          <>
            <Link
              href={`/recetas/${meal.recipe.id}`}
              className="text-body-sm font-semibold text-on-surface leading-snug hover:text-primary transition-colors line-clamp-2"
            >
              {meal.recipe.name}
            </Link>
            <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
              {meal.recipe.calories != null && (
                <span className="flex items-center gap-1">
                  <Flame size={12} />
                  {meal.recipe.calories} kcal
                </span>
              )}
              {meal.recipe.prepTime != null && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {meal.recipe.prepTime} min
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="text-body-sm text-on-surface-variant italic">Sin receta asignada</p>
        )}
      </div>
    </div>
  )
}
