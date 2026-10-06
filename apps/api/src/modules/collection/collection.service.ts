import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, CardCondition } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AddToCollectionDto } from './dto/add-to-collection.dto';
import { UpdateCollectionItemDto } from './dto/update-collection-item.dto';
import { ListCollectionDto } from './dto/list-collection.dto';

// Câmbio de fallback enquanto o worker de exchange rates não roda.
// TODO: substituir por consulta a exchange_rates quando o worker estiver ativo.
const FALLBACK_RATES = {
  USD: 5.0,
  EUR: 5.5,
  BRL: 1.0,
} as const;

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // Adicionar carta à coleção
  // ============================================================

  async add(userId: string, dto: AddToCollectionDto) {
    // Confere que a carta existe no catálogo
    const card = await this.prisma.card.findUnique({
      where: { id: dto.cardId },
      select: { id: true },
    });
    if (!card) {
      throw new NotFoundException(`Carta ${dto.cardId} não encontrada no catálogo`);
    }

    // Tenta consolidar com registro existente compatível
    const existing = await this.prisma.userCard.findFirst({
      where: {
        userId,
        cardId: dto.cardId,
        variant: dto.variant,
        condition: dto.condition as CardCondition,
        purchasePrice: dto.purchasePrice ?? null,
        purchaseCurrency: dto.purchaseCurrency ?? null,
      },
    });

    if (existing) {
      return this.prisma.userCard.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
        include: { card: { select: this.cardListingSelect() } },
      });
    }

    // Cria linha nova
    return this.prisma.userCard.create({
      data: {
        userId,
        cardId: dto.cardId,
        variant: dto.variant,
        quantity: dto.quantity,
        condition: dto.condition as CardCondition,
        purchasePrice: dto.purchasePrice,
        purchaseCurrency: dto.purchaseCurrency,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        notes: dto.notes,
      },
      include: { card: { select: this.cardListingSelect() } },
    });
  }

  // ============================================================
  // Listar coleção do usuário
  // ============================================================

  async list(userId: string, params: ListCollectionDto) {
    const { setId, condition, q, page, pageSize, orderBy, orderDir } = params;

    const where: Prisma.UserCardWhereInput = {
      userId,
      ...(condition && { condition }),
      ...((setId || q) && {
        card: {
          ...(setId && { setId }),
          ...(q && { name: { contains: q, mode: 'insensitive' } }),
        },
      }),
    };

    // Mapeia orderBy do input para a estrutura do Prisma
    const orderByPrisma: Prisma.UserCardOrderByWithRelationInput =
      orderBy === 'name'
        ? { card: { name: orderDir } }
        : orderBy === 'purchaseDate'
          ? { purchaseDate: orderDir }
          : orderBy === 'quantity'
            ? { quantity: orderDir }
            : { createdAt: orderDir };

    const [items, total] = await Promise.all([
      this.prisma.userCard.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: orderByPrisma,
        include: {
          card: { select: this.cardListingSelect() },
        },
      }),
      this.prisma.userCard.count({ where }),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  // ============================================================
  // Detalhe de um item da coleção
  // ============================================================

  async findOne(userId: string, id: string) {
    const item = await this.prisma.userCard.findUnique({
      where: { id },
      include: {
        card: {
          include: {
            set: true,
            prices: { orderBy: { capturedAt: 'desc' } },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item ${id} não encontrado`);
    }
    if (item.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return item;
  }

  // ============================================================
  // Atualizar item
  // ============================================================

  async update(userId: string, id: string, dto: UpdateCollectionItemDto) {
    // Confere ownership
    const existing = await this.prisma.userCard.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) {
      throw new NotFoundException(`Item ${id} não encontrado`);
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    return this.prisma.userCard.update({
      where: { id },
      data: {
        ...(dto.variant !== undefined && { variant: dto.variant }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.condition !== undefined && {
          condition: dto.condition as CardCondition,
        }),
        ...(dto.purchasePrice !== undefined && { purchasePrice: dto.purchasePrice }),
        ...(dto.purchaseCurrency !== undefined && {
          purchaseCurrency: dto.purchaseCurrency,
        }),
        ...(dto.purchaseDate !== undefined && {
          purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
        }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: { card: { select: this.cardListingSelect() } },
    });
  }

  // ============================================================
  // Remover
  // ============================================================

  async remove(userId: string, id: string) {
    const existing = await this.prisma.userCard.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) {
      throw new NotFoundException(`Item ${id} não encontrado`);
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    await this.prisma.userCard.delete({ where: { id } });
  }

  // ============================================================
  // Summary — base do dashboard financeiro
  // ============================================================

  async summary(userId: string) {
    const items = await this.prisma.userCard.findMany({
      where: { userId },
      include: {
        card: {
          include: {
            prices: {
              orderBy: { capturedAt: 'desc' },
              take: 5, // pega os últimos snapshots para escolher o melhor
            },
          },
        },
      },
    });

    let totalValueBRL = 0;
    let totalInvestedBRL = 0;
    const uniqueCardIds = new Set<string>();
    let totalCards = 0;

    for (const item of items) {
      totalCards += item.quantity;
      uniqueCardIds.add(item.cardId);

      // Valor atual: procura preço da variant. Fallback para primeiro disponível.
      const priceMatch =
        item.card.prices.find((p) => p.variant === item.variant && p.source === 'TCGPLAYER') ??
        item.card.prices.find((p) => p.source === 'CARDMARKET') ??
        item.card.prices[0];

      if (priceMatch) {
        const rate = FALLBACK_RATES[priceMatch.currency as keyof typeof FALLBACK_RATES] ?? 1;
        totalValueBRL += Number(priceMatch.price) * rate * item.quantity;
      }

      // Valor investido: soma o purchasePrice convertido
      if (item.purchasePrice) {
        const currency = (item.purchaseCurrency ?? 'BRL') as keyof typeof FALLBACK_RATES;
        const rate = FALLBACK_RATES[currency] ?? 1;
        totalInvestedBRL += Number(item.purchasePrice) * rate * item.quantity;
      }
    }

    const profitLossBRL = totalValueBRL - totalInvestedBRL;
    const roiPercent = totalInvestedBRL > 0 ? (profitLossBRL / totalInvestedBRL) * 100 : 0;

    return {
      totalValueBRL: Number(totalValueBRL.toFixed(2)),
      totalInvestedBRL: Number(totalInvestedBRL.toFixed(2)),
      profitLossBRL: Number(profitLossBRL.toFixed(2)),
      roiPercent: Number(roiPercent.toFixed(2)),
      cardsCount: totalCards,
      uniqueCardsCount: uniqueCardIds.size,
    };
  }

  // ============================================================
  // Helpers
  // ============================================================

  private cardListingSelect() {
    return {
      id: true,
      name: true,
      number: true,
      rarity: true,
      imageSmallUrl: true,
      set: {
        select: {
          id: true,
          name: true,
        },
      },
    } satisfies Prisma.CardSelect;
  }
}
