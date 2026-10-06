// Matrizes booleanas definem o desenho. true = pixel aceso, false = vazio.
// Mantenha pequeno (8x8 ou 10x10) para o estilo ficar reconhecível como pixel art.

const _ = false;
const X = true;

// Pokébola 13x13 — baseada em pixel art clássica, com botão central e separação nítida
// (metade superior sólida, faixa central preta, metade inferior oca que o fundo preenche)
export const POKEBALL: boolean[][] = [
  [_, _, _, _, X, X, X, X, X, _, _, _, _],
  [_, _, X, X, X, X, X, X, X, X, X, _, _],
  [_, X, X, X, X, X, X, X, X, X, X, X, _],
  [_, X, X, X, X, X, X, X, X, X, X, X, _],
  [X, X, X, X, X, X, X, X, X, X, X, X, X],
  [X, X, X, X, X, _, _, _, X, X, X, X, X],
  [X, X, X, X, _, _, X, _, _, X, X, X, X],
  [X, X, X, X, X, _, _, _, X, X, X, X, X],
  [X, X, X, X, X, X, X, X, X, X, X, X, X],
  [_, X, X, X, X, X, X, X, X, X, X, X, _],
  [_, X, X, X, X, X, X, X, X, X, X, X, _],
  [_, _, X, X, X, X, X, X, X, X, X, _, _],
  [_, _, _, _, X, X, X, X, X, _, _, _, _],
];

// Play arrow 7x7 para o CTA "Assista ao vídeo"
export const PLAY: boolean[][] = [
  [X, X, _, _, _, _, _],
  [X, X, X, X, _, _, _],
  [X, X, X, X, X, X, _],
  [X, X, X, X, X, X, X],
  [X, X, X, X, X, X, _],
  [X, X, X, X, _, _, _],
  [X, X, _, _, _, _, _],
];

// Sol 9x9 para toggle light mode
export const SUN: boolean[][] = [
  [_, _, _, _, X, _, _, _, _],
  [_, X, _, _, X, _, _, X, _],
  [_, _, _, X, X, X, _, _, _],
  [_, _, X, X, X, X, X, _, _],
  [X, X, X, X, X, X, X, X, X],
  [_, _, X, X, X, X, X, _, _],
  [_, _, _, X, X, X, _, _, _],
  [_, X, _, _, X, _, _, X, _],
  [_, _, _, _, X, _, _, _, _],
];

// Lua 9x9 para toggle dark mode
export const MOON: boolean[][] = [
  [_, _, _, X, X, X, X, _, _],
  [_, _, X, X, X, X, X, X, _],
  [_, X, X, X, X, _, _, _, _],
  [_, X, X, X, _, _, _, _, _],
  [X, X, X, X, _, _, _, _, _],
  [_, X, X, X, _, _, _, _, _],
  [_, X, X, X, X, _, _, _, _],
  [_, _, X, X, X, X, X, X, _],
  [_, _, _, X, X, X, X, _, _],
];
