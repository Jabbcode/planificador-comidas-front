'use client'

import { useState } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlan } from '@/features/plans/hooks/usePlan'
import MealSlot from '@/features/plans/components/MealSlot'
import { DAY_LABELS, MEAL_TYPES } from '@/features/plans/constants'

function getTodayIndex() {
  return (new Date().getDay() + 6) % 7
}

export default function PlanificadorPage() {
  const { plan, loading, error, generating, refreshing, swappingIds, generate, refresh, toggleLock, swap, deleteMeal } = usePlan()
  const todayIndex = getTodayIndex()
  const [selectedDay, setSelectedDay] = useState(todayIndex)

  if (loading) return <PlanSkeleton />

  if (error) {
    return (
      <div className="px-5 py-6">
        <p className="text-body-md text-error">{error}</p>
      </div>
    )
  }

  const weekStart = plan ? new Date(plan.weekStart) : null

  const getDayDate = (dayIndex: number) => {
    if (!weekStart) return ''
    const d = new Date(weekStart)
    d.setDate(d.getDate() + dayIndex)
    return d.getDate().toString()
  }

  const getMeal = (dayOfWeek: number, mealType: string) =>
    plan?.meals.find(m => m.dayOfWeek === dayOfWeek && m.mealType === mealType)

  const busy = generating || refreshing
  const hasUnlocked = (plan?.meals ?? []).some(m => !m.locked)
  const hasEmptySlots = (plan?.meals.length ?? 0) < 21
  const canGenerate = hasUnlocked || hasEmptySlots
  const canRefresh = hasUnlocked

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-sm font-bold text-on-surface">Esta semana</h1>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            disabled={busy || !canRefresh}
            className="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-label-sm font-semibold text-on-surface-variant disabled:opacity-50 transition-opacity"
          >
            <RefreshCw size={14} className={cn(refreshing && 'animate-spin')} />
            Refrescar
          </button>
          <button
            onClick={generate}
            disabled={busy || !canGenerate}
            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-label-sm font-semibold text-on-primary disabled:opacity-50 transition-opacity"
          >
            {generating
              ? <RefreshCw size={14} className="animate-spin" />
              : <Sparkles size={14} />
            }
            Generar
          </button>
        </div>
      </div>

      {generating && (
        <div className="rounded-2xl bg-primary-container px-4 py-3 text-body-sm text-on-surface">
          Generando semana con IA... esto puede tardar un momento.
        </div>
      )}

      {refreshing && (
        <div className="rounded-2xl bg-surface-container px-4 py-3 text-body-sm text-on-surface">
          Actualizando recetas desbloqueadas...
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DAY_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={cn(
              'flex shrink-0 flex-col items-center rounded-2xl px-3 py-2 transition-all min-w-[52px]',
              selectedDay === i
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant',
              todayIndex === i && selectedDay !== i && 'ring-2 ring-primary ring-inset'
            )}
          >
            <span className="text-label-sm font-semibold">{label}</span>
            <span className="text-label-sm">{getDayDate(i)}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {MEAL_TYPES.map(mealType => {
          const meal = getMeal(selectedDay, mealType)
          return (
            <MealSlot
              key={mealType}
              meal={meal}
              mealType={mealType}
              swapping={meal ? swappingIds.has(meal.id) : false}
              onToggleLock={() => meal && toggleLock(meal)}
              onSwap={() => meal && swap(meal.id)}
              onDelete={() => meal && deleteMeal(meal.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

function PlanSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-7 w-36 rounded-lg bg-surface-container" />
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-14 w-[52px] shrink-0 rounded-2xl bg-surface-container" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-[88px] rounded-2xl bg-surface-container" />
      ))}
    </div>
  )
}
