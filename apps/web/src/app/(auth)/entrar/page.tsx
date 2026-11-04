'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { LoginSchema, type LoginInput } from '@pkmn/validation';
import { ArrowRight } from 'lucide-react';

import { Logo } from '@/components/Logo';
import { FormField } from '@/components/auth/FormField';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import type { ApiError } from '@/lib/api/types';

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const response = await authApi.login(data);
      setSession(response);
      router.push('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message =
        error.response?.data?.message || 'Não foi possível entrar. Verifique suas credenciais.';
      setServerError(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl text-text-primary">Entre na sua conta</h1>
          <p className="text-sm text-text-muted">
            Continue acompanhando sua coleção de onde parou.
          </p>
        </div>

        {/* Formulário */}
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

          <FormField
            label="Senha"
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <Link
              href="/esqueci-senha"
              className="text-xs text-text-muted hover:text-gold-500 transition-colors"
            >
              Esqueci minha senha
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
            {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>

        {/* Link para cadastro */}
        <p className="text-center text-sm text-text-muted">
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="text-gold-500 font-semibold hover:underline">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
