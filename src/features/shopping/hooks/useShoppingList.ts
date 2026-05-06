'use client'

import { useState, useEffect, useCallback } from 'react'
import { planService } from '@/features/plans/services/plan.service'
import { shoppingService } from '../services/shopping.service'
import { toDisplayCategories, type DisplayCategory } from '../utils/aggregate'

const storageKey = (weekPlanId: string) => `shopping-checked-${weekPlanId}`

function loadChecked(weekPlanId: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(weekPlanId))
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveChecked(weekPlanId: string, checked: Set<string>) {
  try {
    localStorage.setItem(storageKey(weekPlanId), JSON.stringify([...checked]))
  } catch {
    // ignore
  }
}

export function useShoppingList() {
  const [weekPlanId, setWeekPlanId] = useState<string | null>(null)
  const [categories, setCategories] = useState<DisplayCategory[]>([])
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noPlan, setNoPlan] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const plan = await planService.getCurrent()
        if (!plan) { setNoPlan(true); return }
        setWeekPlanId(plan.id)
        const raw = await shoppingService.getShoppingList(plan.id)
        setCategories(toDisplayCategories(raw))
        setChecked(loadChecked(plan.id))
      } catch {
        setError('Error al cargar la lista de compras')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggle = useCallback((ingredientId: string) => {
    if (!weekPlanId) return
    setChecked(prev => {
      const next = new Set(prev)
      next.has(ingredientId) ? next.delete(ingredientId) : next.add(ingredientId)
      saveChecked(weekPlanId, next)
      return next
    })
  }, [weekPlanId])

  const clearChecked = useCallback(() => {
    if (!weekPlanId) return
    setChecked(new Set())
    try { localStorage.removeItem(storageKey(weekPlanId)) } catch { /* ignore */ }
  }, [weekPlanId])

  return { categories, checked, loading, error, noPlan, toggle, clearChecked }
}
