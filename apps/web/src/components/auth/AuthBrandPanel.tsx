import { Logo } from '@/components/Logo';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

export function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full h-full p-12 bg-bg-ink overflow-hidden">
      {/* Background decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gold-500/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(rgb(var(--gold-500)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Logo topo */}
      <div className="relative">
        <Logo />
      </div>

      {/* Conteúdo meio */}
      <div className="relative space-y-8 max-w-md">
        <p className="font-pixel text-xs font-black tracking-widest text-gold-500">
          PARA QUEM VIVE POKÉMON
        </p>

        <h2 className="font-display text-display-md leading-[0.95] text-text-primary">
          A SUA COLEÇÃO VAI AGRADECER.
        </h2>

        <ul className="space-y-4 pt-4">
          <FeatureItem icon={<TrendingUp className="w-4 h-4" />}>
            Acompanhe o valor da sua coleção em tempo real
          </FeatureItem>
          <FeatureItem icon={<Sparkles className="w-4 h-4" />}>
            Scanner inteligente para cadastrar em segundos
          </FeatureItem>
          <FeatureItem icon={<Users className="w-4 h-4" />}>
            Conecte-se com colecionadores da sua cidade
          </FeatureItem>
        </ul>
      </div>

      {/* Social proof rodapé */}
      <div className="relative">
        <p className="text-sm text-text-muted">
          Junte-se a <span className="font-mono text-gold-500">+12 mil</span> colecionadores.
        </p>
      </div>
    </div>
  );
}

function FeatureItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-500">
        {icon}
      </span>
      <span className="text-base text-text-primary">{children}</span>
    </li>
  );
}
