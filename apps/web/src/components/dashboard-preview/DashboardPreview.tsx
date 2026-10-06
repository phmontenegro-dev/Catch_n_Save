import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Sparkline } from './Sparkline';
import { PORTFOLIO_MOCK } from './mockData';
import { cn } from '@/lib/utils';

const BRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function DashboardPreview() {
  const {
    totalValueBRL,
    totalInvestedBRL,
    deltaPercent30d,
    deltaBRL30d,
    sparkline,
    topMovers,
    breakdown,
  } = PORTFOLIO_MOCK;

  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        {/* Header da seção */}
        <div className="max-w-2xl mb-16">
          <p className="font-pixel text-xs font-black tracking-widest text-text-primary mb-4">
            SUA COLEÇÃO EM NÚMEROS
          </p>
          <h2 className="font-display text-display-lg leading-[1] text-text-primary mb-6">
            Dinheiro parado é só carta na gaveta.
          </h2>
          <p className="text-base text-text-muted leading-relaxed max-w-lg">
            Catch &apos;n Save transforma sua coleção em um portfólio: você vê quanto investiu,
            quanto vale hoje e para onde o mercado está indo — como se fosse uma carteira de ações.
          </p>
        </div>

        {/* Grid do mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card principal — valor total + sparkline */}
          <div className="lg:col-span-2 bg-bg-ink border border-border-mist rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs text-text-muted mb-2">Valor atual da coleção</p>
                <p className="font-display text-5xl md:text-6xl text-gold-500 leading-none">
                  {BRL(totalValueBRL)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-signal-up/10 border border-signal-up/30 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 text-signal-up" strokeWidth={2.5} />
                <span className="font-mono text-sm text-signal-up font-semibold">
                  +{deltaPercent30d}%
                </span>
              </div>
            </div>

            <Sparkline data={sparkline} height={120} className="mb-6" />

            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>30 dias atrás</span>
              <span className="font-mono text-signal-up">+{BRL(deltaBRL30d)}</span>
              <span>hoje</span>
            </div>
          </div>

          {/* Coluna direita — dois cards menores */}
          <div className="flex flex-col gap-5">
            {/* Investido vs atual */}
            <div className="bg-bg-ink border border-border-mist rounded-2xl p-6">
              <p className="text-xs text-text-muted mb-4">Investido vs. valor atual</p>
              <div className="space-y-3">
                <BarRow label="Investido" value={BRL(totalInvestedBRL)} percent={100} muted />
                <BarRow
                  label="Atual"
                  value={BRL(totalValueBRL)}
                  percent={(totalValueBRL / totalInvestedBRL) * 100}
                />
              </div>
            </div>

            {/* Top valorização */}
            <div className="bg-bg-ink border border-border-mist rounded-2xl p-6 flex-1">
              <p className="text-xs text-text-muted mb-4">Maiores valorizações</p>
              <ul className="space-y-3">
                {topMovers.map((card) => (
                  <li key={card.name} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary truncate">{card.name}</p>
                      <p className="text-xs text-text-faded truncate">{card.set}</p>
                    </div>
                    <div className="flex items-center gap-1 text-signal-up">
                      <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span className="font-mono text-sm font-semibold">+{card.deltaPercent}%</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Breakdown por raridade — largura total */}
          <div className="lg:col-span-3 bg-bg-ink border border-border-mist rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-text-muted">Distribuição por raridade</p>
              <p className="text-xs text-text-faded font-mono">157 cartas</p>
            </div>
            <div className="space-y-4">
              {breakdown.map((item) => (
                <BreakdownRow key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------
// Helpers internos
// ----------------------------------------

function BarRow({
  label,
  value,
  percent,
  muted = false,
}: {
  label: string;
  value: string;
  percent: number;
  muted?: boolean;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs text-text-muted">{label}</span>
        <span className={cn('font-mono text-sm', muted ? 'text-text-muted' : 'text-text-primary')}>
          {value}
        </span>
      </div>
      <div className="h-2 bg-bg-slate rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full', muted ? 'bg-text-faded' : 'bg-gold-500')}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: number;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-text-primary w-40 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-bg-slate rounded-full overflow-hidden">
        <div className="h-full bg-gold-500/70 rounded-full" style={{ width: `${percent}%` }} />
      </div>
      <span className="font-mono text-xs text-text-muted w-16 text-right">{percent}%</span>
      <span className="font-mono text-sm text-text-primary w-24 text-right">
        {value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 0,
        })}
      </span>
    </div>
  );
}
