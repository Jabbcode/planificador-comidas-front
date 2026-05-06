'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChefHat, ListOrdered, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { recipeService } from '@/features/recipes/services/recipe.service'
import IngredientCombobox from '@/features/recipes/components/IngredientCombobox'
import type { MealType, CreateRecipeIngredientInput } from '@/features/recipes/types'

const MEAL_OPTIONS: { value: MealType; label: string }[] = [
  { value: 'BREAKFAST', label: 'Desayuno' },
  { value: 'LUNCH', label: 'Almuerzo' },
  { value: 'DINNER', label: 'Cena' },
]

interface IngredientRow {
  name: string
  quantity: string
  unit: string
}

export default function NuevaRecetaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [mealType, setMealType] = useState<MealType>('LUNCH')
  const [prepTime, setPrepTime] = useState('')
  const [calories, setCalories] = useState('')
  const [servings, setServings] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ name: '', quantity: '', unit: '' }])
  const [steps, setSteps] = useState<string[]>([''])

  const addIngredient = () => setIngredients(prev => [...prev, { name: '', quantity: '', unit: '' }])
  const removeIngredient = (i: number) => setIngredients(prev => prev.filter((_, idx) => idx !== i))
  const updateIngredient = (i: number, field: keyof IngredientRow, value: string) =>
    setIngredients(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row))

  const addStep = () => setSteps(prev => [...prev, ''])
  const removeStep = (i: number) => setSteps(prev => prev.filter((_, idx) => idx !== i))
  const updateStep = (i: number, value: string) =>
    setSteps(prev => prev.map((s, idx) => idx === i ? value : s))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    const validIngredients: CreateRecipeIngredientInput[] = ingredients
      .filter(r => r.name.trim())
      .map(r => ({
        name: r.name.trim(),
        quantity: r.quantity ? Number(r.quantity) : null,
        unit: r.unit.trim() || null,
      }))

    const validSteps = steps.filter(s => s.trim())

    try {
      await recipeService.create({
        name: name.trim(),
        mealType,
        description: description.trim() || undefined,
        instructions: validSteps.length ? validSteps.map((s, i) => `${i + 1}. ${s}`).join('\n') : undefined,
        prepTime: prepTime ? Number(prepTime) : undefined,
        calories: calories ? Number(calories) : undefined,
        servings: servings ? Number(servings) : undefined,
        ingredients: validIngredients.length ? validIngredients : undefined,
      })
      toast.success('Receta creada')
      router.push('/recetas')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo crear la receta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="text-center">
        <h1 className="text-body-lg font-semibold text-on-surface">Añadir Receta</h1>
        <p className="text-label-sm text-on-surface-variant mt-1">
          Crea una nueva experiencia culinaria.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="text-body-sm h-9"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Categoría</label>
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
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Tiempo (min)</label>
              <Input type="number" min={1} placeholder="30" value={prepTime} onChange={e => setPrepTime(e.target.value)} className="text-body-sm h-9" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Porciones</label>
              <Input type="number" min={1} placeholder="2" value={servings} onChange={e => setServings(e.target.value)} className="text-body-sm h-9" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Kcal</label>
              <Input type="number" min={1} placeholder="450" value={calories} onChange={e => setCalories(e.target.value)} className="text-body-sm h-9" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Descripción (opcional)</label>
            <textarea
              placeholder="Breve descripción de la receta..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
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
            <button type="button" onClick={addIngredient} className="text-label-sm font-semibold text-primary">
              + Añadir otro
            </button>
          </div>

          {ingredients.map((row, i) => (
            <div key={i} className="flex flex-col gap-1.5 border-t border-outline-variant pt-3 first:border-0 first:pt-0">
              <div className="flex items-center gap-2">
                <IngredientCombobox
                  value={row.name}
                  onChange={v => updateIngredient(i, 'name', v)}
                />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)} className="text-on-surface-variant hover:text-error transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Cantidad"
                  type="number"
                  min={0}
                  value={row.quantity}
                  onChange={e => updateIngredient(i, 'quantity', e.target.value)}
                  className="text-body-sm h-9 flex-1"
                />
                <Input
                  placeholder="Unidad"
                  value={row.unit}
                  onChange={e => updateIngredient(i, 'unit', e.target.value)}
                  className="text-body-sm h-9 flex-1"
                />
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

          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-sm font-bold mt-1.5">
                {i + 1}
              </span>
              <div className="flex flex-1 gap-2">
                <textarea
                  placeholder={`Paso ${i + 1}...`}
                  value={step}
                  onChange={e => updateStep(i, e.target.value)}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-outline bg-surface-container-low px-3 py-2 text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)} className="text-on-surface-variant hover:text-error transition-colors mt-2">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addStep}
            className="w-full rounded-xl border-2 border-dashed border-outline-variant py-2.5 text-label-sm font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            + Añadir paso
          </button>
        </div>

        <Button type="submit" disabled={loading || !name.trim()} className="rounded-full h-11 text-body-sm font-semibold uppercase tracking-wide">
          {loading ? 'Guardando...' : 'Guardar receta'}
        </Button>

        <button type="button" onClick={() => router.back()} className="text-body-sm text-on-surface-variant text-center pb-2">
          Cancelar
        </button>
      </form>
    </div>
  )
}
