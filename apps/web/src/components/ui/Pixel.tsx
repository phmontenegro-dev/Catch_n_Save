import { cn } from '@/lib/utils';

type PixelProps = {
  pattern: boolean[][];
  size?: number;
  gap?: number;
  className?: string;
  'aria-label'?: string;
};

/**
 * Renderiza arte pixel art em SVG inline a partir de uma matriz booleana.
 * Usa currentColor — herda a cor do contexto e muda com o tema.
 */
export function Pixel({
  pattern,
  size = 4,
  gap = 0,
  className,
  'aria-label': ariaLabel,
}: PixelProps) {
  const rows = pattern.length;
  const cols = pattern[0]?.length ?? 0;
  const step = size + gap;
  const width = cols * step - gap;
  const height = rows * step - gap;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('inline-block fill-current', className)}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
    >
      {pattern.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect key={`${x}-${y}`} x={x * step} y={y * step} width={size} height={size} />
          ) : null,
        ),
      )}
    </svg>
  );
}
