'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Ingredient, CreateIngredientInput, UpdateIngredientInput, Preference } from '../types'

const PREFERENCES: { value: Preference; label: string; activeClass: string }[] = [
  { value: 'LIKED', label: 'Me gusta', activeClass: 'bg-green-100 text-green-700 ring-2 ring-green-300' },
  { value: 'NEUTRAL', label: 'Neutral', activeClass: 'bg-surface-container text-on-surface ring-2 ring-outline' },
  { value: 'DISLIKED', label: 'No me gusta', activeClass: 'bg-red-100 text-red-700 ring-2 ring-red-300' },
]

interface Props {
  open: boolean
  onClose: () => void
  onAdd?: (data: CreateIngredientInput) => Promise<unknown>
  onEdit?: (id: string, data: UpdateIngredientInput) => Promise<unknown>
  ingredient?: Ingredient
}

export default function AddIngredientDialog({ open, onClose, onAdd, onEdit, ingredient }: Props) {
  const isEditing = !!ingredient

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [preference, setPreference] = useState<Preference>('NEUTRAL')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name)
      setCategory(ingredient.category ?? '')
      setPreference(ingredient.preference)
    } else {
      setName('')
      setCategory('')
      setPreference('NEUTRAL')
    }
  }, [ingredient, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      if (isEditing && onEdit && ingredient) {
        await onEdit(ingredient.id, {
          name: name.trim(),
          category: category.trim() || undefined,
          preference,
        })
      } else if (onAdd) {
        await onAdd({
          name: name.trim(),
          category: category.trim() || undefined,
          preference,
        })
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-5 w-[calc(100%-2.5rem)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-body-lg font-semibold">
            {isEditing ? 'Editar ingrediente' : 'Añadir ingrediente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1">
          <Input
            placeholder="Nombre del ingrediente"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
            className="text-body-sm h-9"
          />
          <Input
            placeholder="Categoría (opcional)"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="text-body-sm h-9"
          />
          <div className="flex gap-2">
            {PREFERENCES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPreference(p.value)}
                className={cn(
                  'flex-1 rounded-full py-1.5 text-label-sm font-semibold transition-all',
                  preference === p.value
                    ? p.activeClass
                    : 'bg-surface-container-low text-on-surface-variant'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button type="submit" disabled={loading || !name.trim()} className="rounded-full h-9 text-body-sm">
            {loading ? (isEditing ? 'Guardando...' : 'Añadiendo...') : (isEditing ? 'Guardar cambios' : 'Añadir')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
