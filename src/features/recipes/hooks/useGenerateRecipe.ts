'use client'

import { useState } from 'react'
import { recipeService } from '../services/recipe.service'
import type { Recipe, GenerateRecipeInput } from '../types'

export function useGenerateRecipe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (input: GenerateRecipeInput): Promise<Recipe | null> => {
    setLoading(true)
    setError(null)
    try {
      return await recipeService.generate(input)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar receta')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading, error }
}
