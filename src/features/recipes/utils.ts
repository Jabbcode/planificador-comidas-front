import type { RecipeFormValues } from './schemas'
import type { CreateRecipeInput } from './types'

export const parseSteps = (instructions: string | null): string[] => {
  if (!instructions) return ['']
  const steps = instructions.split('\n').filter(Boolean).map(s => s.replace(/^\d+\.\s*/, ''))
  return steps.length ? steps : ['']
}

export const serializeSteps = (steps: { value: string }[]): string =>
  steps
    .map(s => s.value.trim())
    .filter(Boolean)
    .map((s, i) => `${i + 1}. ${s}`)
    .join('\n')

export const buildRecipePayload = (values: RecipeFormValues): CreateRecipeInput => ({
  name: values.name.trim(),
  mealType: values.mealType,
  description: values.description?.trim() || undefined,
  instructions: serializeSteps(values.steps) || undefined,
  prepTime: values.prepTime ? Number(values.prepTime) : undefined,
  calories: values.calories ? Number(values.calories) : undefined,
  servings: values.servings ? Number(values.servings) : undefined,
  ingredients: values.ingredients
    .filter(r => r.name.trim())
    .map(r => ({
      name: r.name.trim(),
      quantity: r.quantity ? Number(r.quantity) : null,
      unit: r.unit.trim() || null,
    })),
})
