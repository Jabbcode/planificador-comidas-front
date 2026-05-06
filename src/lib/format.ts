export function formatKcal(kcal: number | null | undefined): string {
  if (kcal == null) return '—'
  return `${kcal} kcal`
}

export function formatMinutes(min: number | null | undefined): string {
  if (min == null) return '—'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
