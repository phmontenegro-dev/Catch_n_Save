'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  /** Altura do logo em pixels. Default 48. */
  height?: number;
};

export function Logo({ className, height = 48 }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Durante hidratação, reserva espaço para evitar layout shift
  if (!mounted) {
    return <div style={{ height, aspectRatio: '4 / 1' }} className={className} aria-hidden />;
  }

  const src = resolvedTheme === 'dark' ? '/logo-dark.png' : '/logo-light.png';

  return (
    <Image
      src={src}
      alt="Catch 'n Save"
      width={height * 4}
      height={height}
      priority
      className={cn('select-none', className)}
    />
  );
}
