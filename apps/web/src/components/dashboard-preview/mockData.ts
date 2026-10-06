export const PORTFOLIO_MOCK = {
  totalValueBRL: 12847.0,
  totalInvestedBRL: 10850.0,
  deltaPercent30d: 18.4,
  deltaBRL30d: 1997.0,

  // Pontos para a sparkline — 30 dias
  sparkline: [
    10850, 10920, 10880, 10950, 11020, 10980, 11100, 11180, 11240, 11190, 11300, 11420, 11380,
    11500, 11620, 11580, 11700, 11850, 12010, 11980, 12150, 12290, 12240, 12380, 12520, 12480,
    12650, 12790, 12820, 12847,
  ],

  topMovers: [
    { name: 'Charizard ex', set: 'Obsidian Flames', deltaPercent: 42.3, variant: 'holofoil' },
    { name: 'Pikachu VMAX', set: 'Vivid Voltage', deltaPercent: 28.7, variant: 'rainbow' },
    { name: 'Umbreon V', set: 'Evolving Skies', deltaPercent: 19.1, variant: 'alt art' },
  ],

  breakdown: [
    { label: 'Illustration Rare', value: 3850, percent: 30 },
    { label: 'Secret Rare', value: 3200, percent: 25 },
    { label: 'Holo Rare', value: 2650, percent: 20.5 },
    { label: 'Ultra Rare', value: 2100, percent: 16.5 },
    { label: 'Outros', value: 1047, percent: 8 },
  ],
};
