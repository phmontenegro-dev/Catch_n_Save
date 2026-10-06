import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Pixel } from '@/components/ui/Pixel';
import { PLAY } from '@/components/pixel/patterns';
import { CardStack } from './CardStack';
import { SocialProof } from './SocialProof';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Background decorativo sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold-500 blur-[120px]" />
      </div>

      <div className="container relative grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-12 lg:items-center">
        {/* Esquerda — conteúdo */}
        <div className="space-y-10">
          <p
            className="font-pixel text-xs tracking-widest text-primary"
            style={{ fontWeight: 900, fontVariationSettings: '"ROND" 100' }}
          >
            PARA QUEM VIVE O UNIVERSO POKÉMON
          </p>

          <h1 className="font-display text-display-2xl leading-[0.95] text-text-primary">
            COLECIONE,
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '2px rgb(var(--gold-500))' }}
            >
              ACOMPANHE
            </span>
            <br />
            CONECTE-SE.
          </h1>

          <p className="max-w-md text-base text-text-muted leading-relaxed">
            Organize sua coleção, acompanhe o valor das suas cartas e encontre colecionadores para
            trocar, comprar e vender.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/cadastro">
              <Button variant="primary" size="lg">
                Começar agora
              </Button>
            </Link>
            <button className="group inline-flex items-center gap-3 text-sm text-text-primary">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-glass transition-all group-hover:border-gold-500 group-hover:bg-gold-500/10">
                <Pixel pattern={PLAY} size={2} className="text-text-primary translate-x-0.5" />
              </span>
              Assista ao vídeo
            </button>
          </div>

          <SocialProof />
        </div>

        {/* Direita — slideshow */}
        <div className="relative">
          <CardStack />
        </div>
      </div>
    </section>
  );
}
