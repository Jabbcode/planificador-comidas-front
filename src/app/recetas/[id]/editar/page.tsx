'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRecipe } from '@/features/recipes/hooks/useRecipe'
import { recipeService } from '@/features/recipes/services/recipe.service'
import RecipeForm from '@/features/recipes/components/RecipeForm'
import type { CreateRecipeInput } from '@/features/recipes/types'

export default function EditarRecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { recipe, loading, error } = useRecipe(id)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (data: CreateRecipeInput) => {
    setSaving(true)
    try {
      await recipeService.update(id, data)
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
      <RecipeForm
        recipe={recipe}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        onCancel={() => router.back()}
        loading={saving}
      />
    </div>
  )
}
