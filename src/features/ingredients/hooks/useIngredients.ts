'use client'

import { useState, useEffect, useCallback } from 'react'
import { ingredientService } from '../services/ingredient.service'
import type { Ingredient, Preference, CreateIngredientInput, UpdateIngredientInput } from '../types'

const PREFERENCE_CYCLE: Record<Preference, Preference> = {
  LIKED: 'DISLIKED',
  DISLIKED: 'NEUTRAL',
  NEUTRAL: 'LIKED',
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const data = await ingredientService.getAll()
      setIngredients(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar ingredientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const togglePreference = useCallback(async (id: string, current: Preference) => {
    const next = PREFERENCE_CYCLE[current]
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, preference: next } : i))
    try {
      await ingredientService.update(id, { preference: next })
    } catch {
      setIngredients(prev => prev.map(i => i.id === id ? { ...i, preference: current } : i))
    }
  }, [])

  const addIngredient = useCallback(async (data: CreateIngredientInput) => {
    const created = await ingredientService.create(data)
    setIngredients(prev => [created, ...prev])
    return created
  }, [])

  const updateIngredient = useCallback(async (id: string, data: UpdateIngredientInput) => {
    const updated = await ingredientService.update(id, data)
    setIngredients(prev => prev.map(i => i.id === id ? updated : i))
    return updated
  }, [])

  const removeIngredient = useCallback(async (id: string): Promise<void> => {
    await ingredientService.remove(id)
    setIngredients(prev => prev.filter(i => i.id !== id))
  }, [])

  return { ingredients, loading, error, togglePreference, addIngredient, updateIngredient, removeIngredient }
}
