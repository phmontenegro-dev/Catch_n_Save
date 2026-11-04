'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { RegisterSchema, type RegisterInput } from '@pkmn/validation';
import { ArrowRight } from 'lucide-react';

import { FormField } from '@/components/auth/FormField';
import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import type { ApiError } from '@/lib/api/types';

export default function CadastroPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const response = await authApi.register(data);
      setSession(response);
      router.push('/dashboard');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Não foi possível criar a conta.';
      setServerError(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Painel esquerdo — só em desktop */}
      <AuthBrandPanel />

      {/* Formulário direito */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo mobile */}
          <div className="flex justify-center lg:hidden">
            <Logo />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-display text-3xl text-text-primary">Criar conta</h1>
            <p className="text-sm text-text-muted">Grátis para sempre. Sem cartão de crédito.</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && <Alert variant="error">{serverError}</Alert>}

            <FormField
              label="Nome"
              autoComplete="name"
              placeholder="Como você quer ser chamado"
              error={errors.name?.message}
              {...register('name')}
            />

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
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              hint="Pelo menos 1 letra maiúscula e 1 número"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>

            <p className="text-xs text-text-faded text-center leading-relaxed">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link href="#" className="text-text-muted hover:text-gold-500">
                Termos
              </Link>{' '}
              e{' '}
              <Link href="#" className="text-text-muted hover:text-gold-500">
                Política de Privacidade
              </Link>
              .
            </p>
          </form>

          {/* Link para login */}
          <p className="text-center text-sm text-text-muted">
            Já tem uma conta?{' '}
            <Link href="/entrar" className="text-gold-500 font-semibold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
