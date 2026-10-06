type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
};

export function Sparkline({ data, width = 320, height = 80, className }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return { x, y };
  });

  // Linha principal
  const linePath = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`),
    '',
  );

  // Área preenchida embaixo da linha (fade)
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
    >
      <defs>
        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--gold-500))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(var(--gold-500))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparklineGradient)" />
      <path
        d={linePath}
        fill="none"
        stroke="rgb(var(--gold-500))"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ponto final destacado */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={4}
        fill="rgb(var(--gold-500))"
      />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r={8}
        fill="rgb(var(--gold-500))"
        opacity={0.2}
      />
    </svg>
  );
}
