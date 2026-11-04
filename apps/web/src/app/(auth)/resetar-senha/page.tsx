'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { PasswordSchema } from '@pkmn/validation';
import { CheckCircle2 } from 'lucide-react';

import { Logo } from '@/components/Logo';
import { FormField } from '@/components/auth/FormField';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth.api';
import type { ApiError } from '@/lib/api/types';

// Schema local — não usa o ResetPasswordSchema completo porque
// o token vem da URL, não do formulário
const FormSchema = z
  .object({
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type FormInput = z.infer<typeof FormSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormInput) => {
    if (!token) {
      setServerError('Token inválido ou ausente.');
      return;
    }

    setServerError(null);
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword });
      setSuccess(true);
      // Redireciona pra login após 2s
      setTimeout(() => router.push('/entrar'), 2000);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message =
        error.response?.data?.message ||
        'Não foi possível redefinir a senha. O link pode ter expirado.';
      setServerError(Array.isArray(message) ? message[0] : message);
    }
  };

  // Estado sem token
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <Logo />
          <Alert variant="error" title="Link inválido">
            Este link de redefinição de senha é inválido ou está incompleto.
          </Alert>
          <Link href="/esqueci-senha" className="text-gold-500 hover:underline">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  // Estado de sucesso
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>

          <div className="w-16 h-16 rounded-full bg-signal-up/15 border border-signal-up/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-signal-up" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl text-text-primary">Senha redefinida!</h1>
            <p className="text-sm text-text-muted">
              Sua senha foi alterada com sucesso. Redirecionando para o login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Formulário
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl text-text-primary">Nova senha</h1>
          <p className="text-sm text-text-muted">Escolha uma senha forte.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && <Alert variant="error">{serverError}</Alert>}

          <FormField
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            hint="Pelo menos 1 letra maiúscula e 1 número"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <FormField
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            placeholder="Digite a senha novamente"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetarSenhaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-void" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
