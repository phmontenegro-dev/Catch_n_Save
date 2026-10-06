import { z } from 'zod';

export const ListCollectionSchema = z.object({
  setId: z.string().optional(),
  condition: z.enum(['NM', 'LP', 'MP', 'HP', 'DMG']).optional(),
  q: z.string().optional(), // busca por nome da carta
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
  orderBy: z.enum(['createdAt', 'purchaseDate', 'name', 'quantity']).default('createdAt'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
});

export type ListCollectionDto = z.infer<typeof ListCollectionSchema>;
