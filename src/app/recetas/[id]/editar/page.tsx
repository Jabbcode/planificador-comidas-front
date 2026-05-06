'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ChefHat, ListOrdered, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useRecipe } from '@/features/recipes/hooks/useRecipe'
import { recipeService } from '@/features/recipes/services/recipe.service'
import IngredientCombobox from '@/features/recipes/components/IngredientCombobox'
import type { MealType } from '@/features/recipes/types'

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

export default function EditarRecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { recipe, loading, error } = useRecipe(id)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [mealType, setMealType] = useState<MealType>('LUNCH')
  const [prepTime, setPrepTime] = useState('')
  const [calories, setCalories] = useState('')
  const [servings, setServings] = useState('')
  const [description, setDescription] = useState('')
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ name: '', quantity: '', unit: '' }])
  const [steps, setSteps] = useState<string[]>([''])

  useEffect(() => {
    if (!recipe) return
    setName(recipe.name)
    setMealType(recipe.mealType)
    setPrepTime(recipe.prepTime?.toString() ?? '')
    setCalories(recipe.calories?.toString() ?? '')
    setServings(recipe.servings?.toString() ?? '')
    setDescription(recipe.description ?? '')
    setIngredients(
      recipe.ingredients.length
        ? recipe.ingredients.map(ri => ({
            name: ri.ingredient.name,
            quantity: ri.quantity?.toString() ?? '',
            unit: ri.unit ?? '',
          }))
        : [{ name: '', quantity: '', unit: '' }]
    )
    const parsedSteps = recipe.instructions
      ? recipe.instructions.split('\n').filter(Boolean).map(s => s.replace(/^\d+\.\s*/, ''))
      : ['']
    setSteps(parsedSteps)
  }, [recipe])

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
    setSaving(true)

    const validIngredients = ingredients
      .filter(r => r.name.trim())
      .map(r => ({
        name: r.name.trim(),
        quantity: r.quantity ? Number(r.quantity) : null,
        unit: r.unit.trim() || null,
      }))

    const validSteps = steps.filter(s => s.trim())

    try {
      await recipeService.update(id, {
        name: name.trim(),
        mealType,
        description: description.trim() || undefined,
        instructions: validSteps.length ? validSteps.map((s, i) => `${i + 1}. ${s}`).join('\n') : undefined,
        prepTime: prepTime ? Number(prepTime) : undefined,
        calories: calories ? Number(calories) : undefined,
        servings: servings ? Number(servings) : undefined,
        ingredients: validIngredients.length ? validIngredients : undefined,
      })
      toast.success('Receta actualizada')
      router.push(`/recetas/${id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo actualizar la receta')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-6">
        <Skeleton className="h-8 w-1/2 rounded-lg mx-auto" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-body-md text-on-surface-variant">{error ?? 'Receta no encontrada'}</p>
        <Button variant="outline" className="rounded-full" onClick={() => router.back()}>Volver</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="text-center">
        <h1 className="text-body-lg font-semibold text-on-surface">Editar Receta</h1>
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
            <Input value={name} onChange={e => setName(e.target.value)} required className="text-body-sm h-9" />
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
              <Input type="number" min={1} value={prepTime} onChange={e => setPrepTime(e.target.value)} className="text-body-sm h-9" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Porciones</label>
              <Input type="number" min={1} value={servings} onChange={e => setServings(e.target.value)} className="text-body-sm h-9" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Kcal</label>
              <Input type="number" min={1} value={calories} onChange={e => setCalories(e.target.value)} className="text-body-sm h-9" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">Descripción (opcional)</label>
            <textarea
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
                <Input type="number" min={0} placeholder="Cantidad" value={row.quantity} onChange={e => updateIngredient(i, 'quantity', e.target.value)} className="text-body-sm h-9 flex-1" />
                <Input placeholder="Unidad" value={row.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} className="text-body-sm h-9 flex-1" />
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

        <Button type="submit" disabled={saving || !name.trim()} className="rounded-full h-11 text-body-sm font-semibold uppercase tracking-wide">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>

        <button type="button" onClick={() => router.back()} className="text-body-sm text-on-surface-variant text-center pb-2">
          Cancelar
        </button>
      </form>
    </div>
  )
}
