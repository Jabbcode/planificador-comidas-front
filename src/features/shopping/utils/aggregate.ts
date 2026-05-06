import type { ShoppingCategory } from '../types'

const CATEGORY_META: Record<string, { label: string; emoji: string; order: number }> = {
  proteina:  { label: 'Proteína',   emoji: '🥩', order: 1 },
  verdura:   { label: 'Verdura',    emoji: '🥦', order: 2 },
  carbo:     { label: 'Carbohidrato', emoji: '🌾', order: 3 },
  lacteo:    { label: 'Lácteo',     emoji: '🧀', order: 4 },
  fruta:     { label: 'Fruta',      emoji: '🍎', order: 5 },
  otro:      { label: 'Otros',      emoji: '🛒', order: 6 },
}

export interface DisplayCategory {
  key: string
  label: string
  emoji: string
  items: ShoppingCategory['items']
}

function normalize(key: string): string {
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function toDisplayCategories(categories: ShoppingCategory[]): DisplayCategory[] {
  return categories
    .map(c => {
      const key = normalize(c.category)
      const meta = CATEGORY_META[key] ?? { label: c.category, emoji: '🛒', order: 99 }
      return { key: c.category, label: meta.label, emoji: meta.emoji, order: meta.order, items: c.items }
    })
    .sort((a, b) => a.order - b.order)
    .map(({ key, label, emoji, items }) => ({ key, label, emoji, items }))
}
