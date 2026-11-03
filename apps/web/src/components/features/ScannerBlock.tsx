'use client';

import { Camera, Check, Zap } from 'lucide-react';

export function ScannerBlock() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* ESQUERDA — texto */}
      <div className="space-y-6 order-2 lg:order-1">
        <p className="font-pixel text-xs font-black tracking-widest text-text-primary">
          ESCANEAMENTO INSTANTÂNEO
        </p>

        <h3 className="font-display text-display-md leading-[0.95] text-text-primary">
          APONTE. CLIQUE. CATALOGADO.
        </h3>

        <p className="text-base text-text-muted leading-relaxed max-w-md">
          O scanner identifica sua carta pela câmera, extrai nome, número e coleção, e confirma
          antes de adicionar. Sem digitação, sem procurar em listas.
        </p>

        <ul className="space-y-3 pt-2">
          <ScannerBullet
            icon={<Zap className="w-4 h-4" />}
            text="Reconhecimento em menos de 2 segundos"
          />
          <ScannerBullet
            icon={<Check className="w-4 h-4" />}
            text="Confirmação antes de adicionar à coleção"
          />
          <ScannerBullet
            icon={<Camera className="w-4 h-4" />}
            text="Suporte a cartas em português e inglês"
          />
        </ul>
      </div>

      {/* DIREITA — mockup smartphone */}
      <div className="order-1 lg:order-2 flex justify-center">
        <PhoneMockup />
      </div>
    </div>
  );
}

function ScannerBullet({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-500">
        {icon}
      </span>
      <span className="text-sm text-text-primary">{text}</span>
    </li>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-[340px] h-[680px]">
      {/* Moldura do celular */}
      <div className="absolute inset-0 rounded-[48px] bg-bg-ink border-[3px] border-border-mist shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-bg-void rounded-full z-20" />

        {/* Tela interna */}
        <div className="absolute inset-2 rounded-[42px] overflow-hidden bg-bg-void">
          {/* Status bar simulada */}
          <div className="absolute top-0 left-0 right-0 h-10 flex items-end justify-between px-6 pb-1 text-[10px] text-text-primary font-mono z-10">
            <span>9:41</span>
            <span>100%</span>
          </div>

          {/* Visor da câmera (área cinza simulando preview) */}
          <div className="absolute inset-0 pt-12 pb-16 px-6">
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-bg-slate to-bg-ink overflow-hidden">
              {/* Carta sendo escaneada — representação abstrata */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[195px] rounded-lg bg-gradient-to-b from-signal-pokeball/40 to-gold-500/20 border border-gold-500/40 shadow-[0_0_40px_rgb(var(--gold-500)/0.3)]">
                {/* Simulação de nome/arte da carta */}
                <div className="absolute top-3 left-3 right-3 h-3 rounded bg-text-primary/20" />
                <div className="absolute top-9 inset-x-3 bottom-14 rounded bg-bg-ink/40" />
                <div className="absolute bottom-3 left-3 right-3 h-6 rounded bg-text-primary/10" />
              </div>

              {/* Cantos do scanner (overlay dourado) */}
              <ScannerCorner position="tl" />
              <ScannerCorner position="tr" />
              <ScannerCorner position="bl" />
              <ScannerCorner position="br" />

              {/* Linha de scan animada */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[20%] w-[160px] h-[1px] bg-gold-500 shadow-[0_0_8px_rgb(var(--gold-500))] animate-scan-line" />

              {/* Badge de resultado */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-signal-up/15 border border-signal-up/40 rounded-full backdrop-blur-sm animate-fade-in-up whitespace-nowrap">
                <Check className="w-4 h-4 text-signal-up flex-shrink-0" strokeWidth={3} />
                <span className="text-sm font-semibold text-signal-up">Charizard ex detectado</span>
              </div>
            </div>
          </div>

          {/* Botão de captura */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-4 border-text-primary/40">
            <div className="absolute inset-1.5 rounded-full bg-text-primary" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 20%; opacity: 0; }
          50% { top: 70%; opacity: 1; }
        }
        .animate-scan-line {
          animation: scan-line 2.5s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          20%, 100% { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 2.5s ease-out infinite;
        }
      `}</style>
    </div>
  );
}

function ScannerCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute w-6 h-6 border-gold-500';
  const positions: Record<string, string> = {
    tl: 'top-[20%] left-[22%] border-l-[2px] border-t-[2px] rounded-tl-md',
    tr: 'top-[20%] right-[22%] border-r-[2px] border-t-[2px] rounded-tr-md',
    bl: 'bottom-[28%] left-[22%] border-l-[2px] border-b-[2px] rounded-bl-md',
    br: 'bottom-[28%] right-[22%] border-r-[2px] border-b-[2px] rounded-br-md',
  };
  return <div className={`${base} ${positions[position]}`} />;
}
