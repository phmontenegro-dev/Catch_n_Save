'use client';

import { useEffect, useRef, useState } from 'react';

type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  fillParent?: boolean;
};

export function Sparkline({
  data,
  width = 320,
  height = 80,
  className,
  fillParent = false,
}: SparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);

  // Mede o container real em pixels quando fillParent=true
  useEffect(() => {
    if (!fillParent || !containerRef.current) return;

    const el = containerRef.current;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;

        if (w > 0 && h > 0) {
          setMeasured({
            w: Math.floor(w),
            h: Math.floor(h),
          });
        }
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [fillParent]);

  if (data.length < 2) {
    return fillParent ? (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    ) : null;
  }

  // Enquanto o ResizeObserver ainda não mediu o elemento
  if (fillParent && !measured) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  // Dimensões reais utilizadas no SVG
  const svgWidth = fillParent ? measured!.w : width;
  const svgHeight = fillParent ? measured!.h : height;

  /*
   * Margens mínimas.
   *
   * O objetivo aqui é fazer o gráfico ocupar praticamente
   * toda a área disponível.
   */
  const marginLeft = 0;
  const marginRight = 4;
  const marginTop = 4;
  const marginBottom = 0;

  const chartWidth = Math.max(1, svgWidth - marginLeft - marginRight);

  const chartHeight = Math.max(1, svgHeight - marginTop - marginBottom);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const stepX = chartWidth / (data.length - 1);

  const points = data.map((value, index) => {
    const x = marginLeft + index * stepX;

    const normalizedValue = (value - min) / range;

    const y = marginTop + chartHeight - normalizedValue * chartHeight;

    return {
      x,
      y,
    };
  });

  const linePath = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x},${point.y}`;
    }

    return `${path} L ${point.x},${point.y}`;
  }, '');

  /*
   * Área preenchida.
   *
   * Em vez de usar o primeiro/último ponto como limite,
   * usamos as extremidades do SVG para garantir que o
   * preenchimento ocupe toda a largura.
   */
  const areaPath = `${linePath} ` + `L ${svgWidth},${svgHeight} ` + `L 0,${svgHeight} Z`;

  const lastPoint = points[points.length - 1];

  const svg = (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={fillParent ? undefined : className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--gold-500))" stopOpacity="0.3" />

          <stop offset="100%" stopColor="rgb(var(--gold-500))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Área preenchida */}
      <path d={areaPath} fill="url(#sparklineGradient)" />

      {/* Linha */}
      <path
        d={linePath}
        fill="none"
        stroke="rgb(var(--gold-500))"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glow do último ponto */}
      <circle cx={lastPoint.x} cy={lastPoint.y} r={8} fill="rgb(var(--gold-500))" opacity={0.2} />

      {/* Último ponto */}
      <circle cx={lastPoint.x} cy={lastPoint.y} r={4} fill="rgb(var(--gold-500))" />
    </svg>
  );

  if (fillParent) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {svg}
      </div>
    );
  }

  return svg;
}
