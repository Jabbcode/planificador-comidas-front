'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipeFormSchema, type RecipeFormValues } from '../schemas'
import { parseSteps } from '../utils'
import type { Recipe } from '../types'

const DEFAULT_VALUES: RecipeFormValues = {
  name: '',
  mealType: 'LUNCH',
  prepTime: '',
  calories: '',
  servings: '',
  description: '',
  ingredients: [{ name: '', quantity: '', unit: '' }],
  steps: [{ value: '' }],
}

const recipeToFormValues = (recipe: Recipe): RecipeFormValues => ({
  name: recipe.name,
  mealType: recipe.mealType,
  prepTime: recipe.prepTime?.toString() ?? '',
  calories: recipe.calories?.toString() ?? '',
  servings: recipe.servings?.toString() ?? '',
  description: recipe.description ?? '',
  ingredients: recipe.ingredients.length
    ? recipe.ingredients.map(ri => ({
        name: ri.ingredient.name,
        quantity: ri.quantity?.toString() ?? '',
        unit: ri.unit ?? '',
      }))
    : [{ name: '', quantity: '', unit: '' }],
  steps: parseSteps(recipe.instructions).map(s => ({ value: s })),
})

export function useRecipeForm(recipe?: Recipe) {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe ? recipeToFormValues(recipe) : DEFAULT_VALUES,
  })

  const ingredientFields = useFieldArray({ control: form.control, name: 'ingredients' })
  const stepFields = useFieldArray({ control: form.control, name: 'steps' })

  return { form, ingredientFields, stepFields }
}
