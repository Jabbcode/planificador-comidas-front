'use client'

import { useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useIngredients } from '@/features/ingredients/hooks/useIngredients'
import IngredientItem from '@/features/ingredients/components/IngredientItem'
import AddIngredientDialog from '@/features/ingredients/components/AddIngredientDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { Ingredient, Preference } from '@/features/ingredients/types'

type Filter = 'ALL' | Preference

export default function PreferenciasPage() {
  const { ingredients, loading, error, togglePreference, addIngredient, updateIngredient, removeIngredient } = useIngredients()
  const [filter, setFilter] = useState<Filter>('ALL')
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return ingredients.filter(i => {
      const matchesPref = filter === 'ALL' || i.preference === filter
      const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase())
      return matchesPref && matchesSearch
    })
  }, [ingredients, filter, search])

  const handleDeleteRequest = (id: string) => setPendingDeleteId(id)

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return
    setPendingDeleteId(null)
    try {
      await removeIngredient(pendingDeleteId)
      toast.success('Ingrediente eliminado')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo eliminar el ingrediente.')
    }
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingIngredient(undefined)
  }

  return (
    <>
      <div className="flex flex-col gap-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-headline-md text-on-surface">Preferencias</h1>
          <button
            onClick={() => setDialogOpen(true)}
            aria-label="Añadir ingrediente"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary shadow-elevated transition-transform active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <Input
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-full text-body-sm"
          />
        </div>

        <div className="flex gap-2">
          {([
            { value: 'ALL', label: 'Todos', active: 'bg-surface-container text-on-surface ring-2 ring-outline' },
            { value: 'LIKED', label: 'Me gusta', active: 'bg-green-100 text-green-700 ring-2 ring-green-300' },
            { value: 'DISLIKED', label: 'No me gusta', active: 'bg-red-100 text-red-700 ring-2 ring-red-300' },
          ] as { value: Filter; label: string; active: string }[]).map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'flex-1 rounded-full py-1.5 text-label-sm font-semibold transition-all',
                filter === tab.value ? tab.active : 'bg-surface-container-low text-on-surface-variant'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-6">
        {error && (
          <p className="text-body-sm text-error text-center py-4">{error}</p>
        )}

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px] w-full rounded-xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-body-md text-on-surface-variant">
              {search
                ? `Sin resultados para "${search}"`
                : filter !== 'ALL'
                  ? 'No hay ingredientes en esta categoría.'
                  : '¡Añade tu primer ingrediente con el botón +!'}
            </p>
          </div>
        ) : (
          filtered.map(ingredient => (
            <IngredientItem
              key={ingredient.id}
              ingredient={ingredient}
              onToggle={togglePreference}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          ))
        )}
      </div>

      <AddIngredientDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        ingredient={editingIngredient}
        onAdd={addIngredient}
        onEdit={updateIngredient}
      />

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="¿Eliminar ingrediente?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  )
}
