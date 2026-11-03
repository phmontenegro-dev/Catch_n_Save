'use client';

import { Bell, TrendingUp } from 'lucide-react';

export function PriceHistoryBlock() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* ESQUERDA — gráfico de preço */}
      <div className="order-1">
        <PriceChartMockup />
      </div>

      {/* DIREITA — texto */}
      <div className="space-y-6 order-2">
        <p className="font-pixel text-xs font-black tracking-widest text-text-primary">
          VIGIE O MERCADO
        </p>

        <h3 className="font-display text-display-md leading-[0.95] text-text-primary">
          SAIBA QUANDO AGIR, NÃO QUANDO REAGIR.
        </h3>

        <p className="text-base text-text-muted leading-relaxed max-w-md">
          Histórico completo de preços, alertas por preço-alvo e notificações de valorização
          relevante. Você define as regras, nós monitoramos o mercado.
        </p>

        <ul className="space-y-3 pt-2">
          <PriceBullet text="Snapshots diários de todas as cartas da sua coleção" />
          <PriceBullet text="Alertas customizáveis por preço, variação ou tendência" />
          <PriceBullet text="Comparação de evolução por período: 7d, 30d, 1 ano" />
        </ul>
      </div>
    </div>
  );
}

function PriceBullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-gold-500" />
      <span className="text-sm text-text-primary">{text}</span>
    </li>
  );
}

function PriceChartMockup() {
  // Dados estáticos de uma curva de preço com variações
  const points = [
    { x: 0, y: 70 },
    { x: 50, y: 68 },
    { x: 100, y: 65 },
    { x: 150, y: 72 },
    { x: 200, y: 58 },
    { x: 250, y: 55 },
    { x: 300, y: 62 },
    { x: 350, y: 48 },
    { x: 400, y: 45 },
    { x: 450, y: 50 },
    { x: 500, y: 38 },
    { x: 550, y: 30 },
    { x: 600, y: 25 },
  ];

  const linePath = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`),
    '',
  );

  const areaPath = `${linePath} L 600,120 L 0,120 Z`;

  return (
    <div className="relative bg-bg-ink/60 backdrop-blur-sm border border-border-glass rounded-2xl p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]">
      {/* Header do card */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-text-muted mb-1">Charizard ex — Obsidian Flames</p>
          <p className="font-display text-2xl text-gold-500 leading-none">R$ 847,00</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-signal-up/10 border border-signal-up/30 rounded-full">
          <TrendingUp className="w-3 h-3 text-signal-up" strokeWidth={2.5} />
          <span className="font-mono text-xs text-signal-up font-semibold">+42.3%</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className="relative h-[140px] mb-4">
        <svg viewBox="0 0 600 140" className="w-full h-full block" preserveAspectRatio="none">
          {/* Linha principal */}
          <path
            d={linePath}
            fill="none"
            stroke="rgb(var(--gold-500))"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pontos em cada vértice da curva */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3}
              fill="rgb(var(--bg-ink))"
              stroke="rgb(var(--gold-500))"
              strokeWidth={1.5}
            />
          ))}

          {/* Marcador de alerta disparado — maior, dourado sólido */}
          <circle cx={500} cy={38} r={6} fill="rgb(var(--gold-500))" />
          <circle cx={500} cy={38} r={12} fill="rgb(var(--gold-500))" opacity={0.25}>
            <animate attributeName="r" from="8" to="18" dur="1.8s" repeatCount="indefinite" />
            <animate
              attributeName="opacity"
              from="0.4"
              to="0"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Badge de alerta */}
      <div className="flex items-center gap-3 p-3 bg-gold-500/10 border border-gold-500/30 rounded-lg">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
          <Bell className="w-4 h-4 text-gold-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-text-primary leading-tight">
            Alerta disparado — R$ 800
          </p>
          <p className="text-[11px] text-text-muted leading-tight mt-0.5">
            Preço-alvo atingido há 2 dias
          </p>
        </div>
      </div>
    </div>
  );
}
