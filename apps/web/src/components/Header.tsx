'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Coleção', href: '/colecao' },
  { label: 'Trocas', href: '/trocas' },
  { label: 'Comunidade', href: '/comunidade' },
  { label: 'Preços', href: '/precos' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border-mist bg-bg-void/80 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <div className="container flex h-18 items-center justify-between">
        {/* Esquerda — logo */}
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
        >
          <Logo />
        </Link>

        {/* Centro — nav (hidden em mobile) */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Direita — ações */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Pesquisar"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-slate hover:text-text-primary md:inline-flex"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <ThemeToggle />
          <Link href="/entrar" className="hidden md:inline-block">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/cadastro">
            <Button variant="primary" size="sm">
              Começar agora
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
