import { z } from 'zod';
import { logger } from './logger.js';

const BASE_URL = process.env.POKEMON_TCG_API_URL ?? 'https://api.pokemontcg.io/v2';

// Sem chave: 30 req/min = 1 a cada 2s. Usamos 2.1s para ter folga de segurança.
const REQUEST_DELAY_MS = Number(process.env.POKEMON_TCG_REQUEST_DELAY_MS ?? 2100);

// ============================================================
// Rate limiter simples com fila serial
// ============================================================

let lastRequestAt = 0;

async function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const wait = Math.max(0, lastRequestAt + REQUEST_DELAY_MS - now);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastRequestAt = Date.now();
  return fn();
}

// ============================================================
// Schemas Zod
// ============================================================

const TcgPriceValuesSchema = z
  .object({
    low: z.number().nullish(),
    mid: z.number().nullish(),
    high: z.number().nullish(),
    market: z.number().nullish(),
    directLow: z.number().nullish(),
  })
  .partial();

const TcgplayerSchema = z
  .object({
    url: z.string().optional(),
    updatedAt: z.string().optional(),
    prices: z.record(TcgPriceValuesSchema).optional(),
  })
  .optional();

const CardmarketPricesSchema = z
  .object({
    averageSellPrice: z.number().nullish(),
    lowPrice: z.number().nullish(),
    trendPrice: z.number().nullish(),
    reverseHoloTrend: z.number().nullish(),
    avg1: z.number().nullish(),
    avg7: z.number().nullish(),
    avg30: z.number().nullish(),
  })
  .partial();

const CardmarketSchema = z
  .object({
    url: z.string().optional(),
    updatedAt: z.string().optional(),
    prices: CardmarketPricesSchema.optional(),
  })
  .optional();

const CardResponseSchema = z.object({
  data: z
    .object({
      id: z.string(),
      tcgplayer: TcgplayerSchema,
      cardmarket: CardmarketSchema,
    })
    .passthrough(),
});

export type PokemonTcgIoCardPrices = z.infer<typeof CardResponseSchema>['data'];

// ============================================================
// Fetch com throttling e retry para 429
// ============================================================

async function fetchWithThrottle(url: string): Promise<Response> {
  return throttled(async () => {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });

    // Se a API retornar rate limit, espera e tenta uma vez
    if (res.status === 429) {
      logger.warn({ url }, 'Rate limit hit, aguardando 60s antes de retry');
      await new Promise((r) => setTimeout(r, 60_000));
      return fetch(url, { headers: { Accept: 'application/json' } });
    }

    return res;
  });
}

export async function fetchCardPrices(cardId: string): Promise<PokemonTcgIoCardPrices | null> {
  const url = `${BASE_URL}/cards/${cardId}`;
  const res = await fetchWithThrottle(url);

  if (res.status === 404) {
    logger.debug({ cardId }, 'Carta não encontrada na pokemontcg.io');
    return null;
  }
  if (!res.ok) {
    throw new Error(`pokemontcg.io ${res.status} em ${url}`);
  }

  const json = await res.json();
  const parsed = CardResponseSchema.parse(json);
  return parsed.data;
}

// ============================================================
// Normalização
// ============================================================

export interface PriceRow {
  cardId: string;
  source: 'TCGPLAYER' | 'CARDMARKET';
  variant: string;
  currency: 'USD' | 'EUR';
  price: number;
  capturedAt: Date;
}

export function extractPriceRows(card: PokemonTcgIoCardPrices): PriceRow[] {
  const rows: PriceRow[] = [];

  if (card.tcgplayer?.prices) {
    const capturedAt = parseDate(card.tcgplayer.updatedAt) ?? new Date();
    for (const [variant, values] of Object.entries(card.tcgplayer.prices)) {
      const price = values.market ?? values.mid ?? values.low;
      if (typeof price === 'number' && price > 0) {
        rows.push({
          cardId: card.id,
          source: 'TCGPLAYER',
          variant,
          currency: 'USD',
          price,
          capturedAt,
        });
      }
    }
  }

  if (card.cardmarket?.prices) {
    const capturedAt = parseDate(card.cardmarket.updatedAt) ?? new Date();
    const trend = card.cardmarket.prices.trendPrice;
    if (typeof trend === 'number' && trend > 0) {
      rows.push({
        cardId: card.id,
        source: 'CARDMARKET',
        variant: 'trend',
        currency: 'EUR',
        price: trend,
        capturedAt,
      });
    }
    const reverse = card.cardmarket.prices.reverseHoloTrend;
    if (typeof reverse === 'number' && reverse > 0) {
      rows.push({
        cardId: card.id,
        source: 'CARDMARKET',
        variant: 'reverseHoloTrend',
        currency: 'EUR',
        price: reverse,
        capturedAt,
      });
    }
  }

  return rows;
}

function parseDate(raw?: string): Date | null {
  if (!raw) return null;
  const normalized = raw.replace(/\//g, '-');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}
