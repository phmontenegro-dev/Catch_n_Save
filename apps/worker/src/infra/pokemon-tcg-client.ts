import { z } from 'zod';
import { logger } from './logger.js';

const BASE_URL = process.env.POKEMON_TCG_API_URL ?? 'https://api.pokemontcg.io/v2';
const API_KEY = process.env.POKEMON_TCG_API_KEY;

// Schemas mínimos — validam só o que precisamos, deixam o resto passar como unknown
const SetSchema = z.object({
  id: z.string(),
  name: z.string(),
  series: z.string(),
  ptcgoCode: z.string().optional(),
  printedTotal: z.number(),
  total: z.number(),
  releaseDate: z.string(),
  updatedAt: z.string().optional(),
  images: z.object({ symbol: z.string(), logo: z.string() }).partial().optional(),
  legalities: z.record(z.string()).optional(),
});

const CardSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    supertype: z.string(),
    subtypes: z.array(z.string()).optional(),
    hp: z.string().optional(),
    types: z.array(z.string()).optional(),
    rarity: z.string().optional(),
    artist: z.string().optional(),
    number: z.string(),
    regulationMark: z.string().optional(),
    nationalPokedexNumbers: z.array(z.number()).optional(),
    legalities: z.record(z.string()).optional(),
    images: z.object({ small: z.string(), large: z.string() }).partial().optional(),
    set: z.object({ id: z.string() }),
  })
  .passthrough(); // mantém todos os outros campos para gravarmos em raw_json

export type PokemonTcgSet = z.infer<typeof SetSchema>;
export type PokemonTcgCard = z.infer<typeof CardSchema>;

async function request<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {};
  if (API_KEY) headers['X-Api-Key'] = API_KEY;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Pokémon TCG API ${res.status} em ${url}`);
  }
  const json = await res.json();
  return schema.parse(json);
}

const PaginatedSetsSchema = z.object({
  data: z.array(SetSchema),
  page: z.number(),
  pageSize: z.number(),
  count: z.number(),
  totalCount: z.number(),
});

const PaginatedCardsSchema = z.object({
  data: z.array(CardSchema),
  page: z.number(),
  pageSize: z.number(),
  count: z.number(),
  totalCount: z.number(),
});

export async function fetchAllSets(): Promise<PokemonTcgSet[]> {
  const result = await request('/sets?pageSize=250', PaginatedSetsSchema);
  logger.info({ count: result.totalCount }, 'Sets buscados da API externa');
  return result.data;
}

export async function fetchCardsBySet(setId: string): Promise<PokemonTcgCard[]> {
  const all: PokemonTcgCard[] = [];
  let page = 1;
  const pageSize = 250;

  while (true) {
    const result = await request(
      `/cards?q=set.id:${setId}&pageSize=${pageSize}&page=${page}`,
      PaginatedCardsSchema,
    );
    all.push(...result.data);
    if (all.length >= result.totalCount) break;
    page += 1;
  }

  logger.info({ setId, count: all.length }, 'Cartas buscadas para o set');
  return all;
}
