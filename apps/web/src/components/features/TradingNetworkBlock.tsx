'use client';

import { ArrowRight, Heart, Sparkles, Users } from 'lucide-react';

export function TradingNetworkBlock() {
  return (
    <div className="space-y-12">
      {/* Cabeçalho centralizado */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <p className="font-pixel text-xs font-black tracking-widest text-text-primary">
          REDE DE COMPRAS/TROCAS
        </p>

        <h3 className="font-display text-display-md leading-[0.95] text-text-primary">
          ENCONTRE CARTAS DE MANEIRA EFICAZ.
        </h3>

        <p className="text-base text-text-muted leading-relaxed">
          Marque o que você procura, deixe o sistema cruzar com o que outros colecionadores têm
          disponível e receba a notificação quando houver match perto de você.
        </p>
      </div>

      {/* Fluxo em 3 etapas */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 md:gap-4 items-center">
        <FlowCard
          step="01"
          icon={<Heart className="w-5 h-5" />}
          title="Você procura"
          text="Marca a carta na wishlist e define preço-alvo se quiser"
          example="Charizard ex — Obsidian Flames"
        />

        <FlowArrow />

        <FlowCard
          step="02"
          icon={<Sparkles className="w-5 h-5" />}
          title="Sistema conecta"
          text="Cruza wishlists com anúncios ativos de colecionadores próximos"
          example="3 cartas disponíveis em Curitiba"
          highlighted
        />

        <FlowArrow />

        <FlowCard
          step="03"
          icon={<Users className="w-5 h-5" />}
          title="Match encontrado"
          text="Notificação com perfil, reputação e opção de iniciar conversa"
          example="João, 42 trocas • ★ 4.9"
        />
      </div>
    </div>
  );
}

type FlowCardProps = {
  step: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  example: string;
  highlighted?: boolean;
};

function FlowCard({ step, icon, title, text, example, highlighted }: FlowCardProps) {
  return (
    <div
      className={`relative p-6 rounded-xl border transition-all ${
        highlighted
          ? 'bg-gold-500/5 border-gold-500/40 shadow-[0_0_40px_-10px_rgb(var(--gold-500)/0.3)]'
          : 'bg-bg-ink/60 border-border-glass'
      }`}
    >
      {/* Número da etapa */}
      <p className="font-mono text-xs text-text-faded mb-4">{step}</p>

      {/* Ícone */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
          highlighted
            ? 'bg-gold-500/20 border border-gold-500/40 text-gold-500'
            : 'bg-bg-slate border border-border-mist text-text-primary'
        }`}
      >
        {icon}
      </div>

      {/* Título */}
      <h4 className="font-display text-xl text-text-primary mb-2">{title}</h4>

      {/* Descrição */}
      <p className="text-sm text-text-muted leading-relaxed mb-4">{text}</p>

      {/* Exemplo pequeno */}
      <div className="pt-4 border-t border-border-mist/50">
        <p className="text-[11px] font-mono text-text-faded uppercase tracking-wide mb-1">
          Exemplo
        </p>
        <p className="text-xs text-text-primary">{example}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden md:flex items-center justify-center text-gold-500/60">
      <ArrowRight className="w-6 h-6" />
    </div>
  );
}
