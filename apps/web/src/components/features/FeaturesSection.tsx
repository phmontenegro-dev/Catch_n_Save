import { ScannerBlock } from './ScannerBlock';
import { PriceHistoryBlock } from './PriceHistoryBlock';
import { TradingNetworkBlock } from './TradingNetworkBlock';

export function FeaturesSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decorativo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-gold-500 blur-[160px]" />
        <div className="absolute right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-signal-pokeball blur-[160px]" />
      </div>

      <div className="container relative">
        {/* Header da seção */}
        <div className="max-w-2xl mb-20 md:mb-28">
          <p className="font-pixel text-xs font-black tracking-widest text-gold-500 mb-6">
            TUDO QUE VOCÊ PRECISA
          </p>
          <h2 className="font-display text-display-lg leading-[0.95] text-text-primary">
            FERRAMENTAS PARA COLECIONAR COM INTENÇÃO.
          </h2>
        </div>

        {/* Blocos */}
        <div className="space-y-24 md:space-y-32">
          <ScannerBlock />
          <PriceHistoryBlock />
          <TradingNetworkBlock />
        </div>
      </div>
    </section>
  );
}
