'use client'

import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useShoppingList } from '@/features/shopping/hooks/useShoppingList'
import ShoppingCategoryCard from '@/features/shopping/components/ShoppingCategory'

export default function ComprasPage() {
  const { categories, checked, loading, error, noPlan, toggle, clearChecked } = useShoppingList()

  if (loading) return <ShoppingSkeleton />

  if (error) {
    return (
      <div className="px-5 py-6">
        <p className="text-body-md text-error">{error}</p>
      </div>
    )
  }

  if (noPlan || categories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-5 py-16 text-center">
        <span className="text-5xl">🛒</span>
        <p className="text-body-md text-on-surface-variant">
          No hay plan activo esta semana.
        </p>
        <Link
          href="/planificador"
          className="rounded-full bg-primary px-5 py-2 text-label-md font-semibold text-on-primary"
        >
          Ir al planificador
        </Link>
      </div>
    )
  }

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0)
  const checkedCount = checked.size

  return (
    <div className="flex flex-col gap-5 px-5 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-sm font-bold text-on-surface">Lista de compras</h1>
          <p className="text-body-sm text-on-surface-variant">
            {checkedCount} de {totalItems} items
          </p>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={clearChecked}
            className="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-label-sm font-semibold text-on-surface-variant"
          >
            <Trash2 size={14} />
            Limpiar marcados
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {categories.map(category => (
          <ShoppingCategoryCard
            key={category.key}
            category={category}
            checked={checked}
            onToggle={toggle}
          />
        ))}
      </div>
    </div>
  )
}

function ShoppingSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-7 w-44 rounded-lg bg-surface-container" />
      <div className="h-4 w-24 rounded bg-surface-container" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-surface-container">
          <div className="h-12 rounded-t-2xl bg-surface-container-high" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="mx-4 my-3 h-5 rounded bg-surface-container-high" />
          ))}
        </div>
      ))}
    </div>
  )
}
