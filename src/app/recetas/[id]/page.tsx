'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Users, Flame, Sparkles, Pencil, Trash2, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { cn } from '@/lib/utils'
import { useRecipe } from '@/features/recipes/hooks/useRecipe'
import { recipeService } from '@/features/recipes/services/recipe.service'
import { MEAL_LABEL, MEAL_COLOR } from '@/features/recipes/constants'

export default function RecetaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { recipe, loading, error } = useRecipe(id)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await recipeService.remove(id)
      toast.success('Receta eliminada')
      router.push('/recetas')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo eliminar la receta')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 py-6">
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-2xl" />
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

  const steps = recipe.instructions
    ? recipe.instructions.split('\n').filter(Boolean)
    : []

  return (
    <>
      <div className="flex flex-col gap-4 py-6">
        {/* Header nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-body-sm text-on-surface-variant">
            <ChevronLeft size={18} /> Recetas
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/recetas/${id}/editar`)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:text-primary"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:text-error"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Imagen */}
        <div className="relative h-52 rounded-2xl overflow-hidden bg-surface-container-low">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-on-surface-variant/20">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            </div>
          )}
          {recipe.aiGenerated && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-label-sm font-semibold text-on-primary">
              <Sparkles size={11} /> Generada con IA
            </span>
          )}
        </div>

        {/* Info principal */}
        <div className="flex flex-col gap-2">
          <span className={cn('w-fit rounded-full px-2.5 py-0.5 text-label-sm font-semibold uppercase tracking-wide', MEAL_COLOR[recipe.mealType])}>
            {MEAL_LABEL[recipe.mealType]}
          </span>
          <h1 className="text-headline-md text-on-surface">{recipe.name}</h1>
          {recipe.description && (
            <p className="text-body-sm text-on-surface-variant">{recipe.description}</p>
          )}
          <div className="flex items-center gap-4 text-label-sm text-on-surface-variant mt-1">
            {recipe.prepTime && (
              <span className="flex items-center gap-1"><Clock size={13} />{recipe.prepTime} min</span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1"><Users size={13} />{recipe.servings} pers</span>
            )}
            {recipe.calories && (
              <span className="flex items-center gap-1"><Flame size={13} />{recipe.calories} kcal</span>
            )}
          </div>
        </div>

        {/* Ingredientes */}
        {recipe.ingredients.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm">
            <h2 className="text-body-sm font-semibold text-on-surface">Ingredientes</h2>
            <ul className="flex flex-col gap-2">
              {recipe.ingredients.map(ri => (
                <li key={ri.id} className="flex items-center justify-between">
                  <span className="text-body-sm text-on-surface">{ri.ingredient.name}</span>
                  {(ri.quantity || ri.unit) && (
                    <span className="text-label-sm text-on-surface-variant">
                      {ri.quantity}{ri.unit ? ` ${ri.unit}` : ''}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Instrucciones */}
        {steps.length > 0 && (
          <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-sm">
            <h2 className="text-body-sm font-semibold text-on-surface">Instrucciones</h2>
            <ol className="flex flex-col gap-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary text-label-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="text-body-sm text-on-surface leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="¿Eliminar receta?"
        description="Esta acción no se puede deshacer."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  )
}
