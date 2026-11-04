import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
