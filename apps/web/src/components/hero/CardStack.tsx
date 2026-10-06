'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'warm' | 'cool' | 'crimson';

type Slide = {
  key: string;
  title: string;
  caption: string;
  tone: Tone;
};

const SLIDES: Slide[] = [
  {
    key: 'collection',
    title: 'Sua coleção, catalogada.',
    caption: 'Cada carta registrada, com preço e condição.',
    tone: 'warm',
  },
  {
    key: 'cards',
    title: 'Cada detalhe, preservado.',
    caption: 'Imagens em alta, dados do set, raridade.',
    tone: 'cool',
  },
  {
    key: 'community',
    title: 'Colecionadores conectados.',
    caption: 'Troque com quem está perto de você.',
    tone: 'crimson',
  },
];

const AUTOPLAY_MS = 6000;

// --------------------------------------------------
// Faces das cartas — placeholders até integrar imagens reais
// --------------------------------------------------

function CardBack() {
  return (
    <div className="h-full w-full p-4 flex flex-col items-center justify-center">
      <div className="h-24 w-24 rounded-full border-4 border-signal-pokeball/40 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-signal-pokeball/40" />
      </div>
    </div>
  );
}

function CardArt({ tone }: { tone: Tone }) {
  const toneClass = {
    warm: 'from-gold-500/30 to-gold-700/10',
    cool: 'from-signal-up/25 to-bg-slate',
    crimson: 'from-signal-pokeball/25 to-bg-slate',
  }[tone];

  return (
    <div
      className={cn(
        'h-full w-full p-4 flex flex-col justify-end rounded-2xl bg-gradient-to-br',
        toneClass,
      )}
    >
      <div className="h-20 w-full rounded-md bg-bg-void/50 backdrop-blur-sm" />
    </div>
  );
}

function CardFeature({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="h-full w-full p-6 flex flex-col justify-between">
      <div>
        <p className="font-pixel text-[10px] font-black text-primary mb-3">CATCH 'N SAVE</p>
        <div className="h-32 w-full rounded-lg bg-bg-slate" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-lg leading-tight text-text-primary">{title}</h3>
        <p className="text-xs text-text-muted">{caption}</p>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Componente principal
// --------------------------------------------------

export function CardStack() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[index];

  return (
    <div
      className="relative aspect-[4/5] w-full max-w-lg mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Carta de fundo — ângulo esquerdo */}
      <div
        className={cn(
          'absolute left-0 top-6 h-[75%] w-[55%] rounded-2xl border border-border-glass bg-bg-slate',
          'transition-all duration-700 ease-out',
          '-rotate-6',
          slide.tone === 'warm' && 'shadow-[0_30px_60px_-15px_rgba(245,197,24,0.15)]',
          slide.tone === 'cool' && 'shadow-[0_30px_60px_-15px_rgba(74,222,128,0.12)]',
          slide.tone === 'crimson' && 'shadow-[0_30px_60px_-15px_rgba(230,57,70,0.15)]',
        )}
      >
        <CardBack />
      </div>

      {/* Carta do meio — direita */}
      <div
        className={cn(
          'absolute right-0 top-12 h-[80%] w-[58%] rounded-2xl border border-border-glass bg-bg-slate',
          'transition-all duration-700 ease-out',
          'rotate-3',
          'shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]',
        )}
      >
        <CardArt tone={slide.tone} />
      </div>

      {/* Carta frontal — centro, maior */}
      <div
        key={slide.key}
        className={cn(
          'absolute left-1/2 bottom-0 h-[88%] w-[62%] -translate-x-1/2 rounded-2xl border-2 border-gold-500/40 bg-bg-ink',
          'animate-fade-up',
          'shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]',
        )}
      >
        <CardFeature title={slide.title} caption={slide.caption} />
      </div>

      {/* Indicadores */}
      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setIndex(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === index ? 'w-8 bg-gold-500' : 'w-1.5 bg-border-glass hover:bg-text-muted',
            )}
          />
        ))}
      </div>
    </div>
  );
}
