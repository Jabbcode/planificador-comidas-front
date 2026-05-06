'use client'

import { Controller } from 'react-hook-form'
import { Trash2, ChefHat, ListOrdered, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useRecipeForm } from '../hooks/useRecipeForm'
import IngredientCombobox from './IngredientCombobox'
import { MEAL_OPTIONS } from '../constants'
import { buildRecipePayload } from '../utils'
import type { Recipe } from '../types'
import type { CreateRecipeInput } from '../types'

interface Props {
  recipe?: Recipe
  onSubmit: (data: CreateRecipeInput) => Promise<void>
  submitLabel: string
  onCancel: () => void
  loading?: boolean
}

export default function RecipeForm({ recipe, onSubmit, submitLabel, onCancel, loading = false }: Props) {
  const { form, ingredientFields, stepFields } = useRecipeForm(recipe)
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = form

  const mealType = watch('mealType')

  const handleFormSubmit = handleSubmit(values => onSubmit(buildRecipePayload(values)))

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      {/* Información básica */}
      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-2 text-body-sm font-semibold text-on-surface">
          <Info size={15} className="text-primary" />
          Información Básica
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Nombre de la receta</label>
          <Input
            placeholder="Ej. Bowl de Quinoa Mediterráneo"
            {...register('name')}
            className={cn('text-body-sm h-9', errors.name && 'border-error')}
          />
          {errors.name && <p className="text-label-sm text-error">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Categoría</label>
          <div className="flex gap-2">
            {MEAL_OPTIONS.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setValue('mealType', m.value)}
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
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Tiempo (min)</label>
            <Input type="number" min={1} placeholder="30" {...register('prepTime')} className="text-body-sm h-9" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Porciones</label>
            <Input type="number" min={1} placeholder="2" {...register('servings')} className="text-body-sm h-9" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Kcal</label>
            <Input type="number" min={1} placeholder="450" {...register('calories')} className="text-body-sm h-9" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Descripción (opcional)</label>
          <textarea
            placeholder="Breve descripción de la receta..."
            rows={2}
            {...register('description')}
            className="w-full resize-none rounded-xl border border-outline bg-surface px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Ingredientes */}
      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-body-sm font-semibold text-on-surface">
            <ChefHat size={15} className="text-primary" />
            Ingredientes
          </div>
          <button
            type="button"
            onClick={() => ingredientFields.append({ name: '', quantity: '', unit: '' })}
            className="text-label-sm font-semibold text-primary"
          >
            + Añadir otro
          </button>
        </div>

        {ingredientFields.fields.map((field, i) => (
          <div key={field.id} className="flex flex-col gap-1.5 border-t border-outline-variant pt-3 first:border-0 first:pt-0">
            <div className="flex items-center gap-2">
              <Controller
                name={`ingredients.${i}.name`}
                control={control}
                render={({ field: f }) => (
                  <IngredientCombobox value={f.value} onChange={f.onChange} />
                )}
              />
              {ingredientFields.fields.length > 1 && (
                <button type="button" onClick={() => ingredientFields.remove(i)} className="text-on-surface-variant hover:text-error transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Input type="number" min={0} placeholder="Cantidad" {...register(`ingredients.${i}.quantity`)} className="text-body-sm h-9 flex-1" />
              <Input placeholder="Unidad" {...register(`ingredients.${i}.unit`)} className="text-body-sm h-9 flex-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Instrucciones */}
      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm">
        <div className="flex items-center gap-2 text-body-sm font-semibold text-on-surface">
          <ListOrdered size={15} className="text-primary" />
          Instrucciones
        </div>

        {stepFields.fields.map((field, i) => (
          <div key={field.id} className="flex items-start gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-sm font-bold mt-1.5">
              {i + 1}
            </span>
            <div className="flex flex-1 gap-2">
              <textarea
                placeholder={`Paso ${i + 1}...`}
                rows={2}
                {...register(`steps.${i}.value`)}
                className="flex-1 resize-none rounded-xl border border-outline bg-surface-container-low px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {stepFields.fields.length > 1 && (
                <button type="button" onClick={() => stepFields.remove(i)} className="text-on-surface-variant hover:text-error transition-colors mt-2">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => stepFields.append({ value: '' })}
          className="w-full rounded-xl border-2 border-dashed border-outline-variant py-2.5 text-label-sm font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          + Añadir paso
        </button>
      </div>

      <Button type="submit" disabled={loading} className="rounded-full h-11 text-body-sm font-semibold uppercase tracking-wide">
        {loading ? 'Guardando...' : submitLabel}
      </Button>

      <button type="button" onClick={onCancel} className="text-body-sm text-on-surface-variant text-center pb-2">
        Cancelar
      </button>
    </form>
  )
}
