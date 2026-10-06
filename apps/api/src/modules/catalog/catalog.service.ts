import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { SearchCardsDto } from './dto/search-cards.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // Cards
  // ============================================================

  async searchCards(params: SearchCardsDto) {
    const { q, setId, rarity, type, page, pageSize } = params;

    const where: Prisma.CardWhereInput = {
      ...(q && { name: { contains: q, mode: 'insensitive' } }),
      ...(setId && { setId }),
      ...(rarity && { rarity }),
      ...(type && { types: { has: type } }),
    };

    const [items, total] = await Promise.all([
      this.prisma.card.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ setId: 'asc' }, { number: 'asc' }],
        select: {
          id: true,
          setId: true,
          name: true,
          number: true,
          supertype: true,
          rarity: true,
          types: true,
          imageSmallUrl: true,
          imageLargeUrl: true,
          set: {
            select: {
              id: true,
              name: true,
              series: true,
              logoUrl: true,
            },
          },
        },
      }),
      this.prisma.card.count({ where }),
    ]);

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findCardById(id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        set: true,
        prices: {
          orderBy: { capturedAt: 'desc' },
        },
      },
    });

    if (!card) {
      throw new NotFoundException(`Carta ${id} não encontrada`);
    }

    return card;
  }

  // ============================================================
  // Sets
  // ============================================================

  async listSets() {
    return this.prisma.set.findMany({
      orderBy: { releaseDate: 'desc' },
      select: {
        id: true,
        name: true,
        series: true,
        printedTotal: true,
        total: true,
        releaseDate: true,
        symbolUrl: true,
        logoUrl: true,
        _count: {
          select: { cards: true },
        },
      },
    });
  }

  async findSetById(id: string) {
    const set = await this.prisma.set.findUnique({
      where: { id },
      include: {
        _count: {
          select: { cards: true },
        },
      },
    });

    if (!set) {
      throw new NotFoundException(`Set ${id} não encontrado`);
    }

    return set;
  }
}
