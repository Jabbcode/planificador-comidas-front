'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { recipeService } from '@/features/recipes/services/recipe.service'
import RecipeForm from '@/features/recipes/components/RecipeForm'
import type { CreateRecipeInput } from '@/features/recipes/types'

export default function NuevaRecetaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: CreateRecipeInput) => {
    setLoading(true)
    try {
      await recipeService.create(data)
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
        <p className="text-label-sm text-on-surface-variant mt-1">Crea una nueva experiencia culinaria.</p>
      </div>
      <RecipeForm
        onSubmit={handleSubmit}
        submitLabel="Guardar receta"
        onCancel={() => router.back()}
        loading={loading}
      />
    </div>
  )
}
