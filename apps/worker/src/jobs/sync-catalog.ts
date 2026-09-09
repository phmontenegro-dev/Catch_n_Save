import { PrismaClient } from '@prisma/client';
import { fetchAllSets, fetchCardsBySet } from '../infra/pokemon-tcg-client.js';
import { logger } from '../infra/logger.js';

const prisma = new PrismaClient();

export async function runSyncCatalog() {
  const sets = await fetchAllSets();

  for (const s of sets) {
    await prisma.set.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        name: s.name,
        series: s.series,
        ptcgoCode: s.ptcgoCode,
        printedTotal: s.printedTotal,
        total: s.total,
        releaseDate: new Date(s.releaseDate),
        symbolUrl: s.images?.symbol,
        logoUrl: s.images?.logo,
        legalities: s.legalities ?? {},
        externalUpdatedAt: s.updatedAt ? new Date(s.updatedAt) : null,
      },
      update: {
        name: s.name,
        series: s.series,
        ptcgoCode: s.ptcgoCode,
        printedTotal: s.printedTotal,
        total: s.total,
        releaseDate: new Date(s.releaseDate),
        symbolUrl: s.images?.symbol,
        logoUrl: s.images?.logo,
        legalities: s.legalities ?? {},
        externalUpdatedAt: s.updatedAt ? new Date(s.updatedAt) : null,
        syncedAt: new Date(),
      },
    });

    const cards = await fetchCardsBySet(s.id);
    for (const c of cards) {
      await prisma.card.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          setId: c.set.id,
          name: c.name,
          number: c.number,
          supertype: c.supertype,
          subtypes: c.subtypes ?? [],
          rarity: c.rarity,
          artist: c.artist,
          hp: c.hp,
          types: c.types ?? [],
          regulationMark: c.regulationMark,
          nationalPokedexNumbers: c.nationalPokedexNumbers ?? [],
          legalities: c.legalities ?? {},
          imageSmallUrl: c.images?.small,
          imageLargeUrl: c.images?.large,
          rawJson: c as object,
        },
        update: {
          name: c.name,
          number: c.number,
          supertype: c.supertype,
          subtypes: c.subtypes ?? [],
          rarity: c.rarity,
          artist: c.artist,
          hp: c.hp,
          types: c.types ?? [],
          regulationMark: c.regulationMark,
          nationalPokedexNumbers: c.nationalPokedexNumbers ?? [],
          legalities: c.legalities ?? {},
          imageSmallUrl: c.images?.small,
          imageLargeUrl: c.images?.large,
          rawJson: c as object,
          syncedAt: new Date(),
        },
      });
    }

    logger.info({ setId: s.id, cards: cards.length }, 'Set sincronizado');
  }

  logger.info({ setsCount: sets.length }, 'Sync completo');
}
