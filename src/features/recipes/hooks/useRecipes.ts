'use client'

import { useState, useEffect, useCallback } from 'react'
import { recipeService } from '../services/recipe.service'
import type { Recipe, MealType } from '../types'

export function useRecipes(mealType?: MealType) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await recipeService.getAll(mealType)
      setRecipes(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar recetas')
    } finally {
      setLoading(false)
    }
  }, [mealType])

  useEffect(() => { load() }, [load])

  const removeRecipe = useCallback(async (id: string) => {
    await recipeService.remove(id)
    setRecipes(prev => prev.filter(r => r.id !== id))
  }, [])

  return { recipes, loading, error, reload: load, removeRecipe }
}
