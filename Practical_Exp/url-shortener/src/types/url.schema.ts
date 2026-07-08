import { z } from 'zod';

export const createUrlSchema = z.object({
  longUrl: z.string().url(),
  customAlias: z.string().min(4).max(20).optional(),
  expiresAt: z.string().datetime().optional(),
});
export type CreateUrlInput = z.infer<typeof createUrlSchema>;