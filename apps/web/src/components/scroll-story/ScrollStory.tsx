'use client';

import Link from 'next/link';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Pixel } from '@/components/ui/Pixel';
import { PLAY } from '@/components/pixel/patterns';
import { SocialProof } from '@/components/hero/SocialProof';
import { Sparkline } from '@/components/dashboard-preview/Sparkline';
import { PORTFOLIO_MOCK } from '@/components/dashboard-preview/mockData';
import { useScrollStory } from '@/hooks/useScrollStory';

const BRL = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export function ScrollStory() {
  const containerRef = useScrollStory();

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
    <>
      {/* ========================================================== */}
      {/* SEÇÃO PRINCIPAL — hero + animação de pin + dashboard       */}
      {/* ========================================================== */}

      <section ref={containerRef} className="relative min-h-screen overflow-hidden">
        {/* Background decorativo sutil */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500 blur-[120px]" />
        </div>

        <div className="container relative min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
            {/* ====================================================== */}
            {/* ESQUERDA — hero content ↔ dashboard intro             */}
            {/* ====================================================== */}

            <div className="relative pt-24 pb-16 lg:py-0 lg:pr-8">
              {/* Hero content */}
              <div data-anim="hero-content" className="space-y-10">
                <p className="font-pixel text-xs font-black tracking-widest text-text-primary">
                  PARA QUEM VIVE O UNIVERSO POKÉMON
                </p>

                <h1 className="font-display text-display-2xl leading-[0.95] text-text-primary">
                  COLECIONE,
                  <br />
                  <span
                    className="text-transparent"
                    style={{
                      WebkitTextStroke: '2px rgb(var(--gold-500))',
                    }}
                  >
                    ACOMPANHE
                  </span>
                  <br />
                  CONECTE-SE
                </h1>

                <p className="max-w-md text-base text-text-muted leading-relaxed">
                  Organize sua coleção, acompanhe o valor das suas cartas e encontre colecionadores
                  para trocar, comprar e vender.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/cadastro">
                    <Button variant="primary" size="lg">
                      Começar agora
                    </Button>
                  </Link>

                  <button className="group inline-flex items-center gap-3 text-sm text-text-primary">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-glass transition-all group-hover:border-gold-500 group-hover:bg-gold-500/10">
                      <Pixel
                        pattern={PLAY}
                        size={2}
                        className="text-text-primary translate-x-0.5"
                      />
                    </span>
                    Assista ao vídeo
                  </button>
                </div>

                <SocialProof />
              </div>

              {/* Dashboard intro */}
              <div
                data-anim="dashboard-intro"
                className="
                  absolute
                  inset-0
                  lg:pr-8
                  pt-24
                  pb-16
                  lg:py-0
                  flex
                  flex-col
                  justify-center
                  pointer-events-none
                  lg:pointer-events-auto
                  max-w-sm
                "
              >
                <p className="font-pixel text-xs font-black tracking-widest text-text-primary mb-4">
                  SUA COLEÇÃO EM NÚMEROS
                </p>

                <h2 className="font-display text-display-lg leading-[1] text-text-primary mb-6">
                  Dinheiro parado é só carta na gaveta.
                </h2>

                <p className="text-base text-text-muted leading-relaxed">
                  Catch &apos;n Save transforma sua coleção em um portfólio: você vê quanto
                  investiu, quanto vale hoje e para onde o mercado está indo.
                </p>
              </div>
            </div>

            {/* ====================================================== */}
            {/* DIREITA — composição de cartas e dashboard            */}
            {/* ====================================================== */}

            <div className="hidden lg:block relative h-screen">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Área das cartas */}
                <div className="relative aspect-[4/5] w-full max-w-lg">
                  {/* Carta de fundo */}
                  <div
                    data-anim="card-back"
                    className="
                      absolute
                      left-0
                      top-6
                      h-[75%]
                      w-[55%]
                      rounded-2xl
                      border
                      border-border-glass
                      bg-bg-slate
                      -rotate-6
                      shadow-[0_30px_60px_-15px_rgba(245,197,24,0.15)]
                    "
                  >
                    <div className="h-full w-full p-4 flex flex-col items-center justify-center">
                      <div className="h-24 w-24 rounded-full border-4 border-signal-pokeball/40 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-2 border-signal-pokeball/40" />
                      </div>
                    </div>
                  </div>

                  {/* Carta do meio */}
                  <div
                    data-anim="card-art"
                    className="
                      absolute
                      right-0
                      top-12
                      h-[80%]
                      w-[58%]
                      rounded-2xl
                      border
                      border-border-glass
                      bg-bg-slate
                      rotate-3
                      shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]
                    "
                  >
                    <div className="h-full w-full p-4 flex flex-col justify-end rounded-2xl bg-gradient-to-br from-gold-500/30 to-gold-700/10">
                      <div className="h-20 w-full rounded-md bg-bg-void/50 backdrop-blur-sm" />
                    </div>
                  </div>

                  {/* ================================================= */}
                  {/* MOLDURA FRONTAL                                   */}
                  {/* ================================================= */}

                  <div
                    data-anim="card-front"
                    className="
                      absolute
                      left-1/2
                      bottom-0
                      h-[88%]
                      w-[62%]
                      -translate-x-1/2
                      rounded-2xl
                      border-2
                      border-gold-500/40
                      bg-bg-ink
                      shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]
                      overflow-hidden
                    "
                    style={{
                      transformOrigin: 'center center',
                    }}
                  >
                    {/* Conteúdo inicial da carta */}
                    <div
                      data-anim="card-front-inner"
                      className="
                        absolute
                        inset-0
                        p-6
                        flex
                        flex-col
                        justify-between
                      "
                    >
                      <div>
                        <p className="font-pixel text-[8px] font-black text-text-primary mb-3">
                          CATCH &apos;N SAVE
                        </p>

                        <div className="h-32 w-full rounded-lg bg-bg-slate" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-display text-lg leading-tight text-text-primary">
                          Sua coleção, catalogada.
                        </h3>

                        <p className="text-xs text-text-muted">
                          Cada carta registrada, com preço e condição.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ====================================================== */}
              {/* DASHBOARD PRINCIPAL                                    */}
              {/* ====================================================== */}

              <div
                data-anim="dashboard-front"
                className="absolute top-1/2 left-1/2 w-[90%] pointer-events-none"
                style={{
                  left: '-150px',
                  top: '300px',
                  width: '120%',
                  height: '350px',
                }}
              >
                {/* Conteúdo inteiro do dashboard */}
                <div className="relative flex h-full w-full flex-col px-2 py-2">
                  {/* ================================================= */}
                  {/* HEADER                                             */}
                  {/* ================================================= */}

                  <div className="flex items-end justify-between shrink-0">
                    <div>
                      <p className="text-xs text-text-muted mb-1">Valor atual da coleção</p>

                      <p className="font-display text-5xl text-gold-500 leading-none">
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

                  {/* ================================================= */}
                  {/* GRÁFICO                                           */}
                  {/* ================================================= */}

                  <div className="relative flex-1 min-h-0 w-full">
                    <Sparkline
                      data={sparkline}
                      fillParent
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  {/* ================================================= */}
                  {/* FOOTER                                             */}
                  {/* ================================================= */}

                  <div className="flex items-center justify-between shrink-0 text-xs text-text-muted">
                    <span>30 dias atrás</span>

                    <span className="font-mono text-signal-up">+{BRL(deltaBRL30d)}</span>

                    <span>hoje</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SEÇÃO SECUNDÁRIA — cards + breakdown                       */}
      {/* ========================================================== */}

      <section className="relative -mt-40 pb-24">
        <div className="container space-y-8">
          {/* Cards secundários */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Investido vs atual */}
            <div className="bg-bg-ink border border-border-mist rounded-2xl p-6">
              <p className="text-xs text-text-muted mb-4">Investido vs. valor atual</p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs text-text-muted">Investido</span>

                    <span className="font-mono text-sm text-text-muted">
                      {BRL(totalInvestedBRL)}
                    </span>
                  </div>

                  <div className="h-2 bg-bg-slate rounded-full overflow-hidden">
                    <div
                      className="h-full bg-text-faded rounded-full"
                      style={{
                        width: '100%',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs text-text-muted">Atual</span>

                    <span className="font-mono text-sm text-text-primary">
                      {BRL(totalValueBRL)}
                    </span>
                  </div>

                  <div className="h-2 bg-bg-slate rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500 rounded-full"
                      style={{
                        width: `${(totalValueBRL / totalInvestedBRL) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top valorização */}
            <div className="bg-bg-ink border border-border-mist rounded-2xl p-6">
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

          {/* Breakdown por raridade */}
          <div className="bg-bg-ink border border-border-mist rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-text-muted">Distribuição por raridade</p>

              <p className="text-xs text-text-faded font-mono">157 cartas</p>
            </div>

            <div className="space-y-4">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-sm text-text-primary w-40 flex-shrink-0">{item.label}</span>

                  <div className="flex-1 h-2 bg-bg-slate rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-500/70 rounded-full"
                      style={{
                        width: `${item.percent}%`,
                      }}
                    />
                  </div>

                  <span className="font-mono text-xs text-text-muted w-16 text-right">
                    {item.percent}%
                  </span>

                  <span className="font-mono text-sm text-text-primary w-24 text-right">
                    {item.value.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
