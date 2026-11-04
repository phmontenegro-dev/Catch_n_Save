import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Gradiente radial dourado atrás */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-gold-500/15 blur-[160px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gold-500/10 blur-[100px]" />
      </div>

      {/* Padrão de fundo — pontos sutis */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgb(var(--gold-500)) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Cartas decorativas nos cantos */}
      <DecorativeCard position="tl" />
      <DecorativeCard position="br" />

      {/* Conteúdo central */}
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Eyebrow */}
          <p className="font-pixel text-xs font-black tracking-widest text-gold-500">
            COMECE AGORA
          </p>

          {/* Headline */}
          <h2 className="font-display text-display-lg leading-[0.95] text-text-primary">
            ORGANIZE HOJE,
            <br />
            ACOMPANHE PARA SEMPRE.
          </h2>

          {/* Subtítulo */}
          <p className="text-lg text-text-muted leading-relaxed max-w-xl mx-auto">
            Cadastro em 30 segundos. Grátis para sempre.
          </p>

          {/* CTA principal */}
          <div className="pt-4">
            <Button variant="primary" size="lg" className="group">
              Começar agora
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Social proof */}
          <div className="pt-8 flex items-center justify-center gap-4">
            <AvatarStack />
            <p className="text-sm text-text-muted">
              Junte-se a <span className="font-mono text-gold-500">+12 mil</span> colecionadores
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------
// Avatar stack
// --------------------------------------------------

function AvatarStack() {
  const colors = ['#F5C518', '#E63946', '#4ADE80', '#60A5FA'];

  return (
    <div className="flex -space-x-2">
      {colors.map((color, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-full border-2 border-bg-void flex items-center justify-center text-[10px] font-bold text-bg-void"
          style={{ backgroundColor: color, zIndex: colors.length - i }}
        >
          {String.fromCharCode(65 + i)}
        </div>
      ))}
    </div>
  );
}

// --------------------------------------------------
// Cartas decorativas nos cantos
// --------------------------------------------------

function DecorativeCard({ position }: { position: 'tl' | 'br' }) {
  const positionClasses = {
    tl: 'top-8 left-8 md:top-16 md:left-16 -rotate-12',
    br: 'bottom-8 right-8 md:bottom-16 md:right-16 rotate-12',
  };

  return (
    <div
      className={`pointer-events-none absolute hidden lg:block w-[180px] h-[250px] opacity-40 ${positionClasses[position]}`}
    >
      <div className="relative w-full h-full rounded-lg bg-gradient-to-br from-bg-slate to-bg-ink border border-gold-500/20 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* Topo da carta — nome */}
        <div className="absolute top-3 left-3 right-3 h-3 rounded bg-gold-500/20" />

        {/* Arte da carta */}
        <div className="absolute top-9 left-3 right-3 h-[140px] rounded bg-gradient-to-br from-signal-pokeball/20 to-gold-500/10 border border-gold-500/10">
          {/* Simulação de um pokémon pixel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gold-500/30" />
        </div>

        {/* Linha de HP */}
        <div className="absolute bottom-16 left-3 right-3 h-1.5 rounded bg-text-primary/10" />

        {/* Texto da descrição */}
        <div className="absolute bottom-3 left-3 right-3 space-y-1">
          <div className="h-1 rounded bg-text-primary/10" />
          <div className="h-1 rounded bg-text-primary/10 w-3/4" />
          <div className="h-1 rounded bg-text-primary/10 w-1/2" />
        </div>
      </div>
    </div>
  );
}
