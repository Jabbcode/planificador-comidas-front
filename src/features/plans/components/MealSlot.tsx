import Link from 'next/link'
import { Lock, LockOpen, RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MEAL_LABEL, MEAL_COLOR } from '@/features/recipes/constants'
import type { PlanMeal } from '../types'

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER'

interface Props {
  meal: PlanMeal | undefined
  mealType: MealType
  swapping: boolean
  onToggleLock: () => void
  onSwap: () => void
  onDelete: () => void
}

export default function MealSlot({ meal, mealType, swapping, onToggleLock, onSwap, onDelete }: Props) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={cn('rounded-full px-2.5 py-0.5 text-label-sm font-semibold', MEAL_COLOR[mealType])}>
          {MEAL_LABEL[mealType]}
        </span>
        {meal && (
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleLock}
              aria-label={meal.locked ? 'Desbloquear' : 'Bloquear'}
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {meal.locked ? <Lock size={16} /> : <LockOpen size={16} />}
            </button>
            <button
              onClick={onSwap}
              disabled={swapping || meal.locked}
              aria-label="Cambiar receta"
              className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-40"
            >
              <RefreshCw size={16} className={cn(swapping && 'animate-spin')} />
            </button>
            <button
              onClick={onDelete}
              disabled={meal.locked}
              aria-label="Eliminar receta del plan"
              className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {meal ? (
        <Link
          href={`/recetas/${meal.recipe.id}`}
          className="text-body-sm font-medium text-on-surface leading-snug hover:text-primary transition-colors line-clamp-2"
        >
          {meal.recipe.name}
        </Link>
      ) : (
        <p className="text-body-sm text-on-surface-variant italic">Sin receta asignada</p>
      )}
    </div>
  )
}
