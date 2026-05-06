'use client'

import { useState, useEffect, useCallback } from 'react'
import { planService } from '../services/plan.service'
import type { WeekPlan, PlanMeal } from '../types'

export function usePlan() {
  const [plan, setPlan] = useState<WeekPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [swappingIds, setSwappingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    planService.getCurrent()
      .then(setPlan)
      .catch(e => setError(e instanceof Error ? e.message : 'Error al cargar el plan'))
      .finally(() => setLoading(false))
  }, [])

  const generate = useCallback(async () => {
    if (!plan) return
    setGenerating(true)
    setError(null)
    try {
      const updated = await planService.generate(plan.id)
      setPlan(updated)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar el plan')
    } finally {
      setGenerating(false)
    }
  }, [plan])

  const refresh = useCallback(async () => {
    if (!plan) return
    setRefreshing(true)
    setError(null)
    try {
      const updated = await planService.refresh(plan.id)
      setPlan(updated)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al refrescar el plan')
    } finally {
      setRefreshing(false)
    }
  }, [plan])

  const toggleLock = useCallback(async (meal: PlanMeal) => {
    try {
      await planService.updateMeal(meal.id, { locked: !meal.locked })
      setPlan(prev =>
        prev ? { ...prev, meals: prev.meals.map(m => m.id === meal.id ? { ...m, locked: !meal.locked } : m) } : prev
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar la comida')
    }
  }, [])

  const swap = useCallback(async (mealId: string) => {
    setSwappingIds(prev => new Set(prev).add(mealId))
    setError(null)
    try {
      await planService.swapMeal(mealId)
      const refreshed = await planService.getCurrent()
      setPlan(refreshed)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cambiar la receta')
    } finally {
      setSwappingIds(prev => { const s = new Set(prev); s.delete(mealId); return s })
    }
  }, [])

  return { plan, loading, error, generating, refreshing, swappingIds, generate, refresh, toggleLock, swap }
}
