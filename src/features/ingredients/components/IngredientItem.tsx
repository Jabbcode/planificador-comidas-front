'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Ingredient, Preference } from '../types'

const PREFERENCE_LABEL: Record<Preference, string> = {
  LIKED: 'Me gusta',
  DISLIKED: 'No me gusta',
  NEUTRAL: 'Neutral',
}

const PREFERENCE_CLASS: Record<Preference, string> = {
  LIKED: 'bg-green-100 text-green-700',
  DISLIKED: 'bg-red-100 text-red-700',
  NEUTRAL: 'bg-surface-container text-on-surface-variant',
}

interface Props {
  ingredient: Ingredient
  onToggle: (id: string, current: Preference) => void
  onEdit: (ingredient: Ingredient) => void
  onDelete: (id: string) => void
}

export default function IngredientItem({ ingredient, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-3 shadow-card">
      <button
        onClick={() => onToggle(ingredient.id, ingredient.preference)}
        className="flex flex-1 items-center gap-3 text-left min-w-0"
        aria-label={`Cambiar preferencia de ${ingredient.name}`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-body-sm font-medium text-on-surface truncate">{ingredient.name}</span>
          {ingredient.category && (
            <span className="w-fit rounded-full bg-surface-container px-2 py-0.5 text-label-sm text-on-surface-variant">
              {ingredient.category}
            </span>
          )}
        </div>
        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-label-sm font-semibold tracking-wide', PREFERENCE_CLASS[ingredient.preference])}>
          {PREFERENCE_LABEL[ingredient.preference]}
        </span>
      </button>

      <button
        onClick={() => onEdit(ingredient)}
        aria-label={`Editar ${ingredient.name}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
      >
        <Pencil size={15} strokeWidth={2} />
      </button>
      <button
        onClick={() => onDelete(ingredient.id)}
        aria-label={`Eliminar ${ingredient.name}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-red-50 hover:text-error"
      >
        <Trash2 size={15} strokeWidth={2} />
      </button>
    </div>
  )
}
