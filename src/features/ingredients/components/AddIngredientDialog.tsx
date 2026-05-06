'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ingredientFormSchema, type IngredientFormValues } from '../schemas'
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

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: { name: '', category: '', preference: 'NEUTRAL' },
  })

  useEffect(() => {
    if (open) {
      reset(ingredient
        ? { name: ingredient.name, category: ingredient.category ?? '', preference: ingredient.preference }
        : { name: '', category: '', preference: 'NEUTRAL' }
      )
    }
  }, [open, ingredient, reset])

  const onSubmit = async (values: IngredientFormValues) => {
    const data = {
      name: values.name.trim(),
      category: values.category?.trim() || undefined,
      preference: values.preference,
    }
    if (isEditing && onEdit && ingredient) {
      await onEdit(ingredient.id, data)
    } else if (onAdd) {
      await onAdd(data)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-5 w-[calc(100%-2.5rem)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-body-lg font-semibold">
            {isEditing ? 'Editar ingrediente' : 'Añadir ingrediente'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-1">
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Nombre del ingrediente"
              {...register('name')}
              autoFocus
              className={cn('text-body-sm h-9', errors.name && 'border-error')}
            />
            {errors.name && <p className="text-label-sm text-error">{errors.name.message}</p>}
          </div>

          <Input
            placeholder="Categoría (opcional)"
            {...register('category')}
            className="text-body-sm h-9"
          />

          <Controller
            name="preference"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {PREFERENCES.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => field.onChange(p.value)}
                    className={cn(
                      'flex-1 rounded-full py-1.5 text-label-sm font-semibold transition-all',
                      field.value === p.value
                        ? p.activeClass
                        : 'bg-surface-container-low text-on-surface-variant'
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="rounded-full h-9 text-body-sm">
            {isSubmitting
              ? (isEditing ? 'Guardando...' : 'Añadiendo...')
              : (isEditing ? 'Guardar cambios' : 'Añadir')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
