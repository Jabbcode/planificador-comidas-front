'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ingredientService } from '@/features/ingredients/services/ingredient.service'
import type { Ingredient } from '@/features/ingredients/types'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function IngredientCombobox({ value, onChange, placeholder = 'Ej. Quinoa cocida' }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ingredientService.getAll().then(setIngredients).catch(() => {})
  }, [])

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        if (!query.trim()) onChange('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [query, onChange])

  const filtered = ingredients.filter(i =>
    i.name.toLowerCase().includes(query.toLowerCase())
  )

  const hasExactMatch = ingredients.some(
    i => i.name.toLowerCase() === query.toLowerCase()
  )

  const handleSelect = (name: string) => {
    onChange(name)
    setQuery(name)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl border border-outline bg-surface px-3 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {open && (filtered.length > 0 || (query.trim() && !hasExactMatch)) && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-outline bg-surface shadow-elevated">
          {filtered.map(i => (
            <li key={i.id}>
              <button
                type="button"
                onMouseDown={() => handleSelect(i.name)}
                className="flex w-full items-center justify-between px-3 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <span>{i.name}</span>
                {i.name.toLowerCase() === query.toLowerCase() && (
                  <Check size={13} className="text-primary" />
                )}
              </button>
            </li>
          ))}
          {query.trim() && !hasExactMatch && (
            <li>
              <button
                type="button"
                onMouseDown={() => handleSelect(query.trim())}
                className="flex w-full items-center gap-2 px-3 py-2 text-body-sm text-primary hover:bg-surface-container transition-colors"
              >
                <Plus size={13} />
                Crear &quot;{query.trim()}&quot;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
