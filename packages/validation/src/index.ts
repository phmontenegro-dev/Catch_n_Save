import { z } from 'zod';

// ============================================================
// Auth
// ============================================================

export const RegisterUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ============================================================
// Coleção
// ============================================================

export const CardConditionSchema = z.enum(['NM', 'LP', 'MP', 'HP', 'DMG']);
export const CurrencySchema = z.enum(['BRL', 'USD', 'EUR']);

export const AddUserCardSchema = z.object({
  cardId: z.string().min(1),
  variant: z.string().min(1).default('normal'),
  quantity: z.number().int().positive(),
  condition: CardConditionSchema,
  purchasePrice: z.number().nonnegative().optional(),
  purchaseCurrency: CurrencySchema.optional(),
  purchaseDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
});

export type AddUserCardInput = z.infer<typeof AddUserCardSchema>;

export const UpdateUserCardSchema = AddUserCardSchema.partial().omit({ cardId: true });
export type UpdateUserCardInput = z.infer<typeof UpdateUserCardSchema>;

// ============================================================
// Wishlist
// ============================================================

export const AddWishlistItemSchema = z.object({
  cardId: z.string().min(1),
  targetPrice: z.number().nonnegative().optional(),
  currency: CurrencySchema.default('BRL'),
  priority: z.number().int().min(0).max(10).default(0),
});

export type AddWishlistItemInput = z.infer<typeof AddWishlistItemSchema>;

// ============================================================
// Search de cartas
// ============================================================

export const SearchCardsSchema = z.object({
  q: z.string().optional(),
  setId: z.string().optional(),
  rarity: z.string().optional(),
  type: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(25),
});

export type SearchCardsInput = z.infer<typeof SearchCardsSchema>;
