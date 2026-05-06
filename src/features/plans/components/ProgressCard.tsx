import type { WeekPlan } from '../types'

interface Props {
  plan: WeekPlan
}

export default function ProgressCard({ plan }: Props) {
  const total = 21
  const confirmed = plan.meals.filter(m => m.locked).length
  const percent = Math.round((confirmed / total) * 100)

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-body-sm font-semibold text-on-surface">Semana planificada</span>
        <span className="text-label-sm font-semibold text-primary">{confirmed}/{total}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-container overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-label-sm text-on-surface-variant">
        {confirmed === 0
          ? 'Ninguna comida confirmada aún'
          : confirmed === total
          ? 'Semana completa confirmada'
          : `${percent}% de comidas confirmadas`}
      </p>
    </div>
  )
}
