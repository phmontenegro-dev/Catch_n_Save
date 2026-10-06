import { z } from 'zod';
import { logger } from './logger.js';

const BASE_URL = process.env.TCGDEX_API_URL ?? 'https://api.tcgdex.net/v2';
const LANG = process.env.TCGDEX_LANGUAGE ?? 'en';
const REQUEST_DELAY_MS = Number(process.env.TCGDEX_REQUEST_DELAY_MS ?? 200);
const MAX_RETRIES = Number(process.env.TCGDEX_MAX_RETRIES ?? 3);

// ============================================================
// Schemas de resposta do TCGdex
// ============================================================

const SetBriefSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().optional(),
  symbol: z.string().optional(),
  cardCount: z
    .object({
      total: z.number(),
      official: z.number(),
    })
    .optional(),
});

const SetDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().optional(),
  symbol: z.string().optional(),
  cardCount: z.object({
    total: z.number(),
    official: z.number(),
  }),
  releaseDate: z.string(),
  serie: z.object({ id: z.string(), name: z.string() }),
  legal: z.object({ standard: z.boolean(), expanded: z.boolean() }).optional(),
  cards: z.array(
    z.object({
      id: z.string(),
      localId: z.string(),
      name: z.string(),
      image: z.string().optional(),
    }),
  ),
});

const CardDetailSchema = z
  .object({
    id: z.string(),
    localId: z.string(),
    name: z.string(),
    image: z.string().optional(),
    category: z.string(),
    illustrator: z.string().optional(),
    rarity: z.string().optional(),
    stage: z.string().optional(),
    hp: z.number().optional(),
    types: z.array(z.string()).optional(),
    regulationMark: z.string().optional(),
    dexId: z.array(z.number()).optional(),
    legal: z.object({ standard: z.boolean(), expanded: z.boolean() }).optional(),
    set: z.object({ id: z.string(), name: z.string() }),
    variants: z
      .object({
        firstEdition: z.boolean().optional(),
        holo: z.boolean().optional(),
        normal: z.boolean().optional(),
        reverse: z.boolean().optional(),
        wPromo: z.boolean().optional(),
      })
      .optional(),
  })
  .passthrough();

export type TcgdexSetBrief = z.infer<typeof SetBriefSchema>;
export type TcgdexSetDetail = z.infer<typeof SetDetailSchema>;
export type TcgdexCardDetail = z.infer<typeof CardDetailSchema>;

// ============================================================
// Helpers HTTP com retry e backoff
// ============================================================

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function request<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const url = `${BASE_URL}/${LANG}${path}`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });

      // Retry apenas para status transientes
      if (res.status === 503 || res.status === 502 || res.status === 504 || res.status === 429) {
        const backoffMs = attempt * 2000; // 2s, 4s, 6s
        logger.warn(
          { url, status: res.status, attempt, backoffMs },
          `TCGdex ${res.status}, tentando novamente em ${backoffMs}ms`,
        );
        await sleep(backoffMs);
        continue;
      }

      if (!res.ok) {
        throw new Error(`TCGdex ${res.status} em ${url}`);
      }

      const json = await res.json();
      return schema.parse(json);
    } catch (err) {
      lastError = err;
      // Erro de rede / timeout — também retenta
      if (attempt < MAX_RETRIES) {
        const backoffMs = attempt * 2000;
        logger.warn({ url, attempt, backoffMs }, 'Erro de rede, tentando novamente');
        await sleep(backoffMs);
        continue;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`TCGdex falhou após ${MAX_RETRIES} tentativas em ${url}`);
}

// ============================================================
// Public API
// ============================================================

export async function fetchAllSets(): Promise<TcgdexSetBrief[]> {
  const sets = await request('/sets', z.array(SetBriefSchema));
  logger.info({ count: sets.length }, 'Sets carregados do TCGdex');
  return sets;
}

export async function fetchSetDetail(setId: string): Promise<TcgdexSetDetail> {
  return request(`/sets/${setId}`, SetDetailSchema);
}

export async function fetchCardDetail(cardId: string): Promise<TcgdexCardDetail> {
  await sleep(REQUEST_DELAY_MS);
  return request(`/cards/${cardId}`, CardDetailSchema);
}

// ============================================================
// Composição de URL de imagem
// ============================================================

export function composeImageUrls(baseImage: string | undefined) {
  if (!baseImage) return { small: undefined, large: undefined };
  return {
    small: `${baseImage}/low.png`,
    large: `${baseImage}/high.png`,
  };
}
