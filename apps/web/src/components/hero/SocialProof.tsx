export function SocialProof() {
  const avatars = [
    { bg: 'bg-gold-500', letter: 'P' },
    { bg: 'bg-signal-up', letter: 'A' },
    { bg: 'bg-signal-pokeball', letter: 'L' },
    { bg: 'bg-text-muted', letter: 'M' },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {avatars.map((a, i) => (
          <div
            key={i}
            className={`h-7 w-7 rounded-full ${a.bg} ring-2 ring-bg-void flex items-center justify-center text-xs font-semibold text-bg-void`}
          >
            {a.letter}
          </div>
        ))}
      </div>
      <p className="text-xs text-text-muted">
        <span className="font-mono text-text-primary">+12 mil</span> colecionadores já fazem parte
      </p>
    </div>
  );
}
