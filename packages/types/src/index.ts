// Tipos que refletem o domínio da aplicação, compartilhados entre API e mobile.
// Não confundir com tipos do Prisma (esses ficam privados na API).

export type CardCondition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';

export type PriceSource = 'TCGPLAYER' | 'CARDMARKET';

export type Currency = 'BRL' | 'USD' | 'EUR';

export interface CardPriceSnapshot {
  source: PriceSource;
  variant: string;
  currency: Currency;
  price: number;
  capturedAt: string; // ISO 8601
}

export interface UserCardSummary {
  id: string;
  cardId: string;
  variant: string;
  quantity: number;
  condition: CardCondition;
  purchasePrice: number | null;
  purchaseCurrency: Currency | null;
  purchaseDate: string | null;
}

export interface PortfolioSummary {
  totalValueBRL: number;
  totalInvestedBRL: number;
  profitLossBRL: number;
  roiPercent: number;
  cardsCount: number;
  uniqueCardsCount: number;
}
