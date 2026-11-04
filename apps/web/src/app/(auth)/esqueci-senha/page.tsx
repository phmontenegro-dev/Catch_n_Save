'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { ForgotPasswordSchema, type ForgotPasswordInput } from '@pkmn/validation';
import { ArrowLeft, MailCheck } from 'lucide-react';

import { Logo } from '@/components/Logo';
import { FormField } from '@/components/auth/FormField';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth.api';
import type { ApiError } from '@/lib/api/types';

export default function EsqueciSenhaPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    try {
      await authApi.forgotPassword(data);
      setSent(true);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Erro ao solicitar redefinição de senha.';
      setServerError(Array.isArray(message) ? message[0] : message);
    }
  };

  // Estado pós-envio
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>

          <div className="w-16 h-16 rounded-full bg-signal-up/15 border border-signal-up/30 flex items-center justify-center mx-auto">
            <MailCheck className="w-8 h-8 text-signal-up" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-3xl text-text-primary">Confere seu email</h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Se existe uma conta com{' '}
              <span className="font-mono text-text-primary">{getValues('email')}</span>, você vai
              receber instruções para redefinir sua senha em alguns minutos.
            </p>
          </div>

          <Alert variant="info" title="Não chegou?">
            Verifica a caixa de spam. O remetente é{' '}
            <span className="font-mono">onboarding@resend.dev</span>.
          </Alert>

          <Link
            href="/entrar"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </Link>
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
          <h1 className="font-display text-3xl text-text-primary">Esqueceu a senha?</h1>
          <p className="text-sm text-text-muted">
            Digite seu email e enviaremos um link para redefinir.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && <Alert variant="error">{serverError}</Alert>}

          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar link de redefinição'}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/entrar"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
