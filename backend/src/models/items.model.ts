import { z } from "zod";

export const itemSchema = z.object (
    {
        id: z.string(),
        name: z.string().min(2, 'Name of the item must be at least 2 character'),
        price: z.string().min(1, "Price must be at least 1 character"),
        description: z.string().min(4, 'Description must be at least 4 character'),
        material: z.string(),
        size: z.string(),
        color: z.string(),
        category: z.string(),
        image: z.string().min(5, "Filename + extension").optional().or(z.literal('')),
        owner: z.string().uuid(),
        created: z.string(),
        updated: z.string(),
    }
)

export type Item = z.infer<typeof itemSchema>

export const itemCreateRequestSchema = z.object(
    {
        name: z.string().min(2, "Name must be at least 2 character"),
        price: z.string().min(1, "Price must be at least 1 character"),
        description: z.string().min(4, "Description must be at least 4 character"),
        material: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        category: z.string().optional(),
        other: z.string().optional(),
        image: z.string().min(5, "Filename + extension").optional().or(z.literal('')),
        owner: z.string().uuid()
    }
)

export type ItemCreateRequest = z.infer<typeof itemCreateRequestSchema>

export const itemByIdRequestSchema = z.coerce.number().int().positive()

// item update schema

export const itemUpdateRequestSchema = z.object(
    {
        id: z.number().positive(),
        name: z.string().min(2, "Name must be at least 2 character"),
        price: z.string().min(1, "Price must be at least 1 character"),
        description: z.string().min(4, "Description must be at least 4 character"),
        material: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        category: z.string().optional(),
        other: z.string().optional(),
        image: z.string().min(5, "Filename + extension").optional().or(z.literal(''))
    }
  )
  export type ItemUpdateRequest = z.infer<typeof itemUpdateRequestSchema>