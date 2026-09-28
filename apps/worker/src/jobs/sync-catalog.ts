import { PrismaClient } from '@prisma/client';
import {
  fetchAllSets,
  fetchSetDetail,
  fetchCardDetail,
  composeImageUrls,
} from '../infra/tcgdex-client.js';
import { logger } from '../infra/logger.js';

const prisma = new PrismaClient();

export async function runSyncCatalog() {
  const setsBrief = await fetchAllSets();

  for (const brief of setsBrief) {
    try {
      const detail = await fetchSetDetail(brief.id);

      // Upsert do set
      const setImages = composeImageUrls(detail.logo);
      await prisma.set.upsert({
        where: { id: detail.id },
        create: {
          id: detail.id,
          name: detail.name,
          series: detail.serie.name,
          printedTotal: detail.cardCount.official,
          total: detail.cardCount.total,
          releaseDate: new Date(detail.releaseDate),
          symbolUrl: detail.symbol,
          logoUrl: setImages.large ?? detail.logo,
          legalities: detail.legal ?? {},
        },
        update: {
          name: detail.name,
          series: detail.serie.name,
          printedTotal: detail.cardCount.official,
          total: detail.cardCount.total,
          releaseDate: new Date(detail.releaseDate),
          symbolUrl: detail.symbol,
          logoUrl: setImages.large ?? detail.logo,
          legalities: detail.legal ?? {},
          syncedAt: new Date(),
        },
      });

      // Para cada carta do set, buscar detalhe completo e persistir
      let ok = 0;
      let fail = 0;
      for (const cardBrief of detail.cards) {
        try {
          const card = await fetchCardDetail(cardBrief.id);
          const images = composeImageUrls(card.image);

          // Mapeamentos que o schema espera
          const subtypes = card.stage ? [card.stage] : [];
          const hp = typeof card.hp === 'number' ? String(card.hp) : undefined;

          await prisma.card.upsert({
            where: { id: card.id },
            create: {
              id: card.id,
              setId: card.set.id,
              name: card.name,
              number: card.localId,
              supertype: card.category,
              subtypes,
              rarity: card.rarity,
              artist: card.illustrator,
              hp,
              types: card.types ?? [],
              regulationMark: card.regulationMark,
              nationalPokedexNumbers: card.dexId ?? [],
              legalities: card.legal ?? {},
              imageSmallUrl: images.small,
              imageLargeUrl: images.large,
              rawJson: card as object,
            },
            update: {
              name: card.name,
              number: card.localId,
              supertype: card.category,
              subtypes,
              rarity: card.rarity,
              artist: card.illustrator,
              hp,
              types: card.types ?? [],
              regulationMark: card.regulationMark,
              nationalPokedexNumbers: card.dexId ?? [],
              legalities: card.legal ?? {},
              imageSmallUrl: images.small,
              imageLargeUrl: images.large,
              rawJson: card as object,
              syncedAt: new Date(),
            },
          });
          ok += 1;
        } catch (err) {
          fail += 1;
          logger.warn({ cardId: cardBrief.id, err }, 'Falha ao sincronizar carta');
        }
      }

      logger.info({ setId: detail.id, ok, fail }, 'Set sincronizado');
    } catch (err) {
      logger.error({ setId: brief.id, err }, 'Falha ao sincronizar set — pulando');
    }
  }

  logger.info({ setsCount: setsBrief.length }, 'Sync do catálogo concluído');
}
