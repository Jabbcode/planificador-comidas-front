'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecipes } from '@/features/recipes/hooks/useRecipes'
import RecipeCard from '@/features/recipes/components/RecipeCard'
import MealTypeFilter from '@/features/recipes/components/MealTypeFilter'
import GenerateRecipeSheet from '@/features/recipes/components/GenerateRecipeSheet'
import type { MealTypeFilterValue } from '@/features/recipes/components/MealTypeFilter'
import type { Recipe } from '@/features/recipes/types'

export default function RecetasPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<MealTypeFilterValue>('ALL')
  const [search, setSearch] = useState('')
  const [generateOpen, setGenerateOpen] = useState(false)

  const { recipes, loading, error, reload } = useRecipes()

  const filtered = useMemo(() =>
    recipes.filter(r => {
      const matchesMeal = filter === 'ALL' || r.mealType === filter
      const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase())
      return matchesMeal && matchesSearch
    }),
    [recipes, filter, search]
  )

  const handleGenerated = (recipe: Recipe) => {
    toast.success(`Receta "${recipe.name}" generada`)
    reload()
  }

  return (
    <>
      <div className="flex flex-col gap-4 pt-6 pb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <Input
            placeholder="Buscar recetas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-full text-body-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setGenerateOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-surface-container py-2.5 text-body-sm font-semibold text-on-surface-variant transition-all active:scale-95"
          >
            <Sparkles size={15} className="text-primary" />
            Generar con IA
          </button>
          <button
            onClick={() => router.push('/recetas/nuevo')}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-body-sm font-semibold text-on-primary shadow-elevated transition-all active:scale-95"
          >
            <Plus size={15} />
            Añadir receta
          </button>
        </div>

        <MealTypeFilter value={filter} onChange={setFilter} />

        {!loading && (
          <span className="w-fit rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-on-surface-variant">
            {filtered.length < recipes.length
              ? `${filtered.length} de ${recipes.length} recetas`
              : `${recipes.length} ${recipes.length === 1 ? 'receta' : 'recetas'}`}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 pb-6">
        {error && (
          <p className="text-body-sm text-error text-center py-4">{error}</p>
        )}

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[260px] w-full rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-body-md text-on-surface-variant">
              {search
                ? `Sin resultados para "${search}"`
                : '¡Añade o genera tu primera receta!'}
            </p>
          </div>
        ) : (
          filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        )}
      </div>

      <GenerateRecipeSheet
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        onGenerated={handleGenerated}
      />
    </>
  )
}
