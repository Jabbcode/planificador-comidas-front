import { cn } from '@/lib/utils'
import type { MealType } from '../types'

type Filter = 'ALL' | MealType

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'BREAKFAST', label: 'Desayuno' },
  { value: 'LUNCH', label: 'Almuerzo' },
  { value: 'DINNER', label: 'Cena' },
]

interface Props {
  value: Filter
  onChange: (value: Filter) => void
}

export default function MealTypeFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            'shrink-0 rounded-full px-4 py-1.5 text-label-sm font-semibold transition-all',
            value === f.value
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export type { Filter as MealTypeFilterValue }
