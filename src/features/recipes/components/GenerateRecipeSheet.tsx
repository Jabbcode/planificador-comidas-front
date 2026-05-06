'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useGenerateRecipe } from '../hooks/useGenerateRecipe'
import { MEAL_OPTIONS } from '../constants'
import type { MealType, Recipe } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onGenerated: (recipe: Recipe) => void
}

export default function GenerateRecipeSheet({ open, onClose, onGenerated }: Props) {
  const [mealType, setMealType] = useState<MealType>('LUNCH')
  const [extraConstraints, setExtraConstraints] = useState('')
  const { generate, loading } = useGenerateRecipe()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const recipe = await generate({ mealType, extraConstraints: extraConstraints.trim() || undefined })
    if (recipe) {
      onGenerated(recipe)
      onClose()
      setExtraConstraints('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-5 w-[calc(100%-2.5rem)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-body-lg font-semibold flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Generar receta con IA
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1">
          <div className="flex gap-2">
            {MEAL_OPTIONS.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMealType(m.value)}
                className={cn(
                  'flex-1 rounded-full py-1.5 text-label-sm font-semibold transition-all',
                  mealType === m.value
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface-variant'
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Input
            placeholder="Restricciones extra (opcional): sin gluten, vegano…"
            value={extraConstraints}
            onChange={e => setExtraConstraints(e.target.value)}
            className="text-body-sm h-9"
          />
          <Button type="submit" disabled={loading} className="rounded-full h-9 text-body-sm">
            {loading ? 'Generando con IA…' : 'Generar receta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
