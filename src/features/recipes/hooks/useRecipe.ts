'use client'

import { useState, useEffect } from 'react'
import { recipeService } from '../services/recipe.service'
import type { Recipe } from '../types'

export function useRecipe(id: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    recipeService.getById(id)
      .then(setRecipe)
      .catch(e => setError(e instanceof Error ? e.message : 'Error al cargar la receta'))
      .finally(() => setLoading(false))
  }, [id])

  return { recipe, setRecipe, loading, error }
}
