import Link from 'next/link'
import { Clock, Users, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recipe } from '../types'

const MEAL_LABEL: Record<string, string> = {
  BREAKFAST: 'Desayuno',
  LUNCH: 'Almuerzo',
  DINNER: 'Cena',
}

const MEAL_COLOR: Record<string, string> = {
  BREAKFAST: 'bg-amber-100 text-amber-700',
  LUNCH: 'bg-green-100 text-green-700',
  DINNER: 'bg-indigo-100 text-indigo-700',
}

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link href={`/recetas/${recipe.id}`} className="block rounded-2xl overflow-hidden bg-surface shadow-sm active:scale-[0.99] transition-transform">
      <div className="relative h-44 bg-surface-container-low">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </div>
        )}
        {recipe.aiGenerated && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-label-sm font-semibold text-on-primary">
            <Sparkles size={10} /> IA
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <span className={cn('w-fit rounded-full px-2 py-0.5 text-label-sm font-semibold uppercase tracking-wide', MEAL_COLOR[recipe.mealType])}>
          {MEAL_LABEL[recipe.mealType]}
        </span>
        <p className="text-body-md font-semibold text-on-surface leading-tight">{recipe.name}</p>
        <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
          {recipe.prepTime && (
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {recipe.prepTime} min
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users size={13} />
              {recipe.servings} pers
            </span>
          )}
          {recipe.calories && (
            <span>{recipe.calories} kcal</span>
          )}
        </div>
      </div>
    </Link>
  )
}
