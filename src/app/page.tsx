'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { usePlan } from '@/features/plans/hooks/usePlan'
import ProgressCard from '@/features/plans/components/ProgressCard'
import DaySelector from '@/features/plans/components/DaySelector'
import MealCard from '@/features/plans/components/MealCard'
import UpcomingMeals from '@/features/plans/components/UpcomingMeals'
import { MEAL_TYPES } from '@/features/plans/constants'
import { todayDayOfWeek, formatDayFullES, formatDateLongES, getWeekDates } from '@/lib/date'

export default function HomePage() {
  const { plan, loading } = usePlan()
  const todayIndex = todayDayOfWeek()
  const [selectedDay, setSelectedDay] = useState(todayIndex)

  if (loading) return <DashboardSkeleton />

  const hasAnyMeals = (plan?.meals.length ?? 0) > 0
  const weekStart = plan ? new Date(plan.weekStart) : null
  const selectedDate = weekStart ? getWeekDates(weekStart)[selectedDay] : null

  const getMeal = (dayOfWeek: number, mealType: string) =>
    plan?.meals.find(m => m.dayOfWeek === dayOfWeek && m.mealType === mealType)

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-headline-sm font-bold text-on-surface">Vista Semanal</h1>
        <p className="text-body-sm text-on-surface-variant capitalize">
          {selectedDate ? `Hoy es ${formatDateLongES(new Date())}` : 'Cargando...'}
        </p>
      </div>

      {plan && <ProgressCard plan={plan} />}

      {weekStart && (
        <DaySelector
          weekStart={weekStart}
          selectedDay={selectedDay}
          todayIndex={todayIndex}
          onChange={setSelectedDay}
        />
      )}

      {!hasAnyMeals ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-8 shadow-sm text-center">
          <CalendarDays size={40} className="text-on-surface-variant opacity-40" />
          <div className="flex flex-col gap-1">
            <p className="text-body-md font-semibold text-on-surface">Sin plan para esta semana</p>
            <p className="text-body-sm text-on-surface-variant">Genera tu semana desde el planificador</p>
          </div>
          <Link
            href="/planificador"
            className="rounded-full bg-primary px-5 py-2 text-label-sm font-semibold text-on-primary"
          >
            Ir al planificador
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <h2 className="text-title-sm font-semibold text-on-surface">
              {selectedDay === todayIndex ? 'Hoy' : formatDayFullES(selectedDay)}
            </h2>
            <div className="flex flex-col gap-3">
              {MEAL_TYPES.map(mealType => (
                <MealCard
                  key={mealType}
                  meal={getMeal(selectedDay, mealType)}
                  mealType={mealType}
                />
              ))}
            </div>
          </div>

          {plan && <UpcomingMeals plan={plan} />}
        </>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="flex flex-col gap-1.5">
        <div className="h-7 w-40 rounded-lg bg-surface-container" />
        <div className="h-4 w-56 rounded-lg bg-surface-container" />
      </div>
      <div className="h-20 rounded-2xl bg-surface-container" />
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-14 w-[52px] shrink-0 rounded-2xl bg-surface-container" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-52 rounded-2xl bg-surface-container" />
      ))}
    </div>
  )
}
