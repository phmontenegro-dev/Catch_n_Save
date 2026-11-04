import { z } from 'zod';

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve ter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve ter pelo menos um número'),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
