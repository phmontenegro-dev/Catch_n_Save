'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg-void">
      <header className="border-b border-border-mist">
        <div className="container py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">
              Olá, <span className="text-text-primary font-semibold">{user?.name}</span>
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-16">
        <h1 className="font-display text-display-md text-text-primary mb-4">
          Bem-vindo ao Catch 'n Save
        </h1>
        <p className="text-text-muted">
          Esse é o dashboard placeholder. As telas reais vêm nas próximas fases.
        </p>
      </main>
    </div>
  );
}
