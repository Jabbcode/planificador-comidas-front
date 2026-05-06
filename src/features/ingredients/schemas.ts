import { z } from 'zod'

export const ingredientFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.string().optional(),
  preference: z.enum(['LIKED', 'NEUTRAL', 'DISLIKED']),
})

export type IngredientFormValues = z.infer<typeof ingredientFormSchema>
