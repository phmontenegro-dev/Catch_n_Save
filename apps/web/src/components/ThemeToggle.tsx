'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Pixel } from './ui/Pixel';
import { SUN, MOON } from './pixel/patterns';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="group flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-slate hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
    >
      <Pixel
        pattern={isDark ? SUN : MOON}
        size={2}
        className="transition-transform group-hover:scale-110"
      />
    </button>
  );
}
