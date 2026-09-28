import { PrismaClient } from '@prisma/client';
import { fetchCardPrices, extractPriceRows } from '../infra/pokemon-tcg-io-client.js';
import { logger } from '../infra/logger.js';

const prisma = new PrismaClient();

// Limite gratuito da pokemontcg.io sem chave é 1000/dia.
// Guardamos margem: reservamos 900 para snapshot, sobra para eventuais retries.
const MAX_CARDS_PER_RUN = Number(process.env.SNAPSHOT_MAX_CARDS ?? 900);

export async function runSnapshotPrices() {
  // 1) Descobrir todas as cartas que precisam de preço (coleções + wishlists)
  const [userCardIds, wishlistCardIds] = await Promise.all([
    prisma.userCard.findMany({ select: { cardId: true }, distinct: ['cardId'] }),
    prisma.wishlist.findMany({ select: { cardId: true }, distinct: ['cardId'] }),
  ]);

  const allTargetIds = Array.from(
    new Set([...userCardIds.map((c) => c.cardId), ...wishlistCardIds.map((c) => c.cardId)]),
  );

  logger.info(
    { total: allTargetIds.length, maxPerRun: MAX_CARDS_PER_RUN },
    'Cartas alvo para snapshot de preço',
  );

  // 2) Priorização: pega as cartas com snapshot mais antigo primeiro (ou nunca sincronizadas)
  // Assim, mesmo que tenhamos mais cartas que o limite diário, elas rotacionam ao longo dos dias.
  const cardsWithLastSnapshot = await prisma.card.findMany({
    where: { id: { in: allTargetIds } },
    select: {
      id: true,
      prices: {
        select: { capturedAt: true },
        orderBy: { capturedAt: 'desc' },
        take: 1,
      },
    },
  });

  const sorted = cardsWithLastSnapshot.sort((a, b) => {
    const dateA = a.prices[0]?.capturedAt?.getTime() ?? 0;
    const dateB = b.prices[0]?.capturedAt?.getTime() ?? 0;
    return dateA - dateB; // mais antigos primeiro
  });

  const cardIds = sorted.slice(0, MAX_CARDS_PER_RUN).map((c) => c.id);

  logger.info({ count: cardIds.length }, 'Cartas selecionadas para este run');

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const cardId of cardIds) {
    try {
      const card = await fetchCardPrices(cardId);
      if (!card) {
        skipped += 1;
        continue;
      }

      const rows = extractPriceRows(card);
      if (rows.length === 0) {
        skipped += 1;
        continue;
      }

      await prisma.$transaction(async (tx) => {
        for (const row of rows) {
          await tx.cardPrice.upsert({
            where: {
              cardId_source_variant: {
                cardId: row.cardId,
                source: row.source,
                variant: row.variant,
              },
            },
            create: {
              cardId: row.cardId,
              source: row.source,
              variant: row.variant,
              currency: row.currency,
              price: row.price,
              capturedAt: row.capturedAt,
            },
            update: {
              currency: row.currency,
              price: row.price,
              capturedAt: row.capturedAt,
            },
          });

          await tx.priceHistory.create({
            data: {
              cardId: row.cardId,
              source: row.source,
              variant: row.variant,
              currency: row.currency,
              price: row.price,
              recordedAt: row.capturedAt,
            },
          });
        }
      });

      updated += 1;
    } catch (err) {
      failed += 1;
      logger.warn({ cardId, err }, 'Falha ao atualizar preço');
    }
  }

  const remaining = Math.max(0, allTargetIds.length - MAX_CARDS_PER_RUN);
  logger.info(
    { updated, skipped, failed, remainingForNextRun: remaining },
    'Snapshot de preços concluído',
  );
}
