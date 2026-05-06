import { cn } from '@/lib/utils'
import { formatDayShortES, getWeekDates } from '@/lib/date'

interface Props {
  weekStart: Date
  selectedDay: number
  todayIndex: number
  onChange: (day: number) => void
}

export default function DaySelector({ weekStart, selectedDay, todayIndex, onChange }: Props) {
  const dates = getWeekDates(weekStart)

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {dates.map((date, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={cn(
            'flex shrink-0 flex-col items-center rounded-2xl px-3 py-2 min-w-[52px] transition-all',
            selectedDay === i
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant',
            todayIndex === i && selectedDay !== i && 'ring-2 ring-primary ring-inset'
          )}
        >
          <span className="text-label-sm font-semibold">{formatDayShortES(i)}</span>
          <span className="text-label-sm">{date.getDate()}</span>
        </button>
      ))}
    </div>
  )
}
