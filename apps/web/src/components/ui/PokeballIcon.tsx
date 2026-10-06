type PokeballIconProps = {
  size?: number;
  className?: string;
};

/**
 * Pokébola pixel art colorida — réplica do logo do produto.
 * Cores fixas (vermelho + branco + preto). Para versão monocromática
 * que herda do contexto, use <Pixel pattern={POKEBALL} />.
 */
export function PokeballIcon({ size = 32, className }: PokeballIconProps) {
  const RED = '#C62828';
  const WHITE = '#F2EFE8';
  const BLACK = '#0A0A0A';
  const HIGHLIGHT = '#FFFFFF';

  // Padrão 14x14 — vermelho em cima, highlight no topo-esquerdo,
  // outline preto, faixa central preta e botão central branco.
  type Row = (string | null)[];
  const _ = null;

  const pattern: Row[] = [
    [_, _, _, _, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, _, _, _, _],
    [_, _, BLACK, BLACK, RED, RED, RED, RED, RED, RED, BLACK, BLACK, _, _],
    [_, BLACK, RED, HIGHLIGHT, HIGHLIGHT, RED, RED, RED, RED, RED, RED, RED, BLACK, _],
    [_, BLACK, RED, HIGHLIGHT, HIGHLIGHT, RED, RED, RED, RED, RED, RED, RED, BLACK, _],
    [BLACK, RED, RED, RED, RED, RED, RED, RED, RED, RED, RED, RED, RED, BLACK],
    [BLACK, RED, RED, RED, RED, RED, RED, RED, RED, RED, RED, RED, RED, BLACK],
    [
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
      BLACK,
    ],
    [
      BLACK,
      WHITE,
      WHITE,
      BLACK,
      BLACK,
      WHITE,
      WHITE,
      WHITE,
      BLACK,
      BLACK,
      WHITE,
      WHITE,
      WHITE,
      BLACK,
    ],
    [
      BLACK,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      BLACK,
      BLACK,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      BLACK,
    ],
    [
      BLACK,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      WHITE,
      BLACK,
    ],
    [_, BLACK, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, BLACK, _],
    [_, BLACK, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, BLACK, _],
    [_, _, BLACK, BLACK, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, BLACK, BLACK, _, _],
    [_, _, _, _, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, _, _, _, _],
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {pattern.map((row, y) =>
        row.map((color, x) =>
          color ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} /> : null,
        ),
      )}
    </svg>
  );
}
