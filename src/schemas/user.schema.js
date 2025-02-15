import { z } from 'zod';

/**
 * Schema for user sign-up validation.
 * Ensures valid name, email, and password requirements.
 */
export const signUpSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: 'Name is required' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),
    email: z.string().trim().toLowerCase().email({ message: 'Invalid email format. Please enter a valid email.' }),
    password: z
        .string()
        .min(6, { message: 'Password should be at least 6 characters long.' })
        .max(100, { message: 'Password cannot exceed 100 characters.' })
        .trim(),
});

/**
 * Schema for user sign-in validation.
 * Ensures email and password fields are correctly formatted.
 */
export const signinSchema = z.object({
    email: z.string().trim().toLowerCase().email({ message: 'Invalid email format. Please enter a valid email.' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long.' })
        .max(100, { message: 'Password cannot exceed 100 characters.' })
        .trim(),
});
