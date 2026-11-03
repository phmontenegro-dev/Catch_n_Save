'use client';

import { useEffect, useState } from 'react';
import { MapPin, Repeat, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivityCard = {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  position: 'tl' | 'tr' | 'bl' | 'br'; // top-left, top-right, bottom-left, bottom-right
};

const ACTIVITIES: ActivityCard[] = [
  {
    id: '1',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    title: 'Ana em Curitiba',
    subtitle: 'cadastrou 23 cartas',
    position: 'tr',
  },
  {
    id: '2',
    icon: <Repeat className="w-3.5 h-3.5" />,
    title: 'Troca concluída',
    subtitle: 'São Paulo ↔ Rio de Janeiro',
    position: 'bl',
  },
  {
    id: '3',
    icon: <Search className="w-3.5 h-3.5" />,
    title: 'Pedro em Belo Horizonte',
    subtitle: 'procura: Charizard ex',
    position: 'tl',
  },
  {
    id: '4',
    icon: <MapPin className="w-3.5 h-3.5" />,
    title: 'Novo colecionador',
    subtitle: 'em Recife',
    position: 'br',
  },
];

const INTERVAL_MS = 4000;

const POSITION_CLASSES: Record<ActivityCard['position'], string> = {
  tl: 'top-4 left-4',
  tr: 'top-4 right-4',
  bl: 'bottom-4 left-4',
  br: 'bottom-4 right-4',
};

export function ActivityFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % ACTIVITIES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const current = ACTIVITIES[currentIndex];

  return (
    <div
      key={current.id}
      className={cn(
        'absolute z-10 flex items-center gap-3 px-4 py-3',
        'bg-bg-ink/90 backdrop-blur-md border border-border-glass',
        'rounded-lg shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]',
        'animate-fade-up',
        POSITION_CLASSES[current.position],
      )}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-500">
        {current.icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-text-primary leading-tight">{current.title}</p>
        <p className="text-[11px] text-text-muted leading-tight mt-0.5">{current.subtitle}</p>
      </div>
    </div>
  );
}
