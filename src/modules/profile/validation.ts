import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().int().min(18, 'You must be at least 18 years old'),
  gender: z.string().min(1, 'Gender is required'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  interests: z.array(z.string()).optional(),
  location: z.string().optional(),
  preferences: z.object({
    gender: z.string(),
    minAge: z.number().int().min(18),
    maxAge: z.number().int().max(100),
  }).optional(),
});
