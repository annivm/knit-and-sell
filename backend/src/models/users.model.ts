import { z } from 'zod';

const userSchema = z.object(
    {
        id: z.string(),
        name: z.string().min(1, "Name of the user must be at least 1 character").max(100, "Name of the user must be less then 100 characters" ),
        email: z.string().email("Must be a valid email"),
        password: z.string(),
        created: z.string(),
        updated: z.string()
    }
)
export type User = z.infer<typeof userSchema>;


export const signUpUserSchema = z.object(
    {
        id: z.string().optional(),
        name: z.string().min(1, "Name of the user must be at least 1 character").max(100, "Name of the user must be less then 100 characters" ),
        email: z.string().email("Must be a valid email"),
        password: z.string()
    }
)
export type UserCreateRequest = z.infer<typeof signUpUserSchema>;


export const loginUserRequestSchema = z.object(
    {
        email: z.string().email("Must be a valid email"),
        password: z.string().min(1, "Password must be at least 1 character")
    }
)
export type LoginUserRequest = z.infer<typeof loginUserRequestSchema>;