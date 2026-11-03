import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BrazilMap } from './BrazilMap';
import { ActivityFeed } from './ActivityFeed';

const CITY_STATS = [
  { name: 'São Paulo', count: 4892 },
  { name: 'Rio de Janeiro', count: 3156 },
  { name: 'Belo Horizonte', count: 1834 },
  { name: 'Curitiba', count: 1247 },
];

const BR = (n: number) => n.toLocaleString('pt-BR');

export function CommunitySection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decorativo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-signal-pokeball blur-[140px]" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* ESQUERDA — mapa (3/5 do grid) */}
          <div className="lg:col-span-3 relative">
            <div className="relative aspect-square w-full max-w-xl mx-auto">
              <BrazilMap />
              <ActivityFeed />
            </div>

            {/* Legenda discreta */}
            <p className="text-center mt-8 text-xs text-text-faded">
              <span className="font-mono text-text-muted">+12 mil</span> colecionadores ativos em{' '}
              <span className="font-mono text-text-muted">214</span> cidades
            </p>
          </div>

          {/* DIREITA — conteúdo editorial (2/5 do grid) */}
          <div className="lg:col-span-2 space-y-8">
            <p className="font-pixel text-xs font-black tracking-widest text-text-primary">
              COLECIONADORES PRÓXIMOS
            </p>

            <h2 className="font-display text-display-lg leading-[0.95] text-text-primary">
              QUEM ESTÁ COLECIONANDO PERTO DE VOCÊ.
            </h2>

            <p className="text-base text-text-muted leading-relaxed max-w-md">
              Encontre colecionadores na sua cidade, descubra cartas disponíveis para troca e
              participe de encontros presenciais sem passar por grupos de WhatsApp caóticos.
            </p>

            {/* Lista de cidades */}
            <ul className="space-y-3 border-t border-border-mist pt-6">
              {CITY_STATS.map((city) => (
                <li key={city.name} className="flex items-center justify-between">
                  <span className="text-sm text-text-primary">{city.name}</span>
                  <span className="font-mono text-sm text-gold-500">
                    {BR(city.count)} <span className="text-text-faded">colecionadores</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button variant="outline" size="md" className="group">
                Ver colecionadores perto de mim
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
