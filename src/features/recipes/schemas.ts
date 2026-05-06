import { z } from 'zod'

export const recipeFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER']),
  prepTime: z.string().optional(),
  calories: z.string().optional(),
  servings: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
    unit: z.string(),
  })),
  steps: z.array(z.object({ value: z.string() })),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>
