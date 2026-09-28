-- CreateEnum
CREATE TYPE "CardCondition" AS ENUM ('NM', 'LP', 'MP', 'HP', 'DMG');

-- CreateEnum
CREATE TYPE "PriceSource" AS ENUM ('TCGPLAYER', 'CARDMARKET');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "ptcgo_code" TEXT,
    "printed_total" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "symbol_url" TEXT,
    "logo_url" TEXT,
    "legalities" JSONB,
    "external_updated_at" TIMESTAMP(3),
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "set_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "supertype" TEXT NOT NULL,
    "subtypes" TEXT[],
    "rarity" TEXT,
    "artist" TEXT,
    "hp" TEXT,
    "types" TEXT[],
    "regulation_mark" TEXT,
    "national_pokedex_numbers" INTEGER[],
    "legalities" JSONB,
    "image_small_url" TEXT,
    "image_large_url" TEXT,
    "raw_json" JSONB NOT NULL,
    "external_updated_at" TIMESTAMP(3),
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_cards" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "condition" "CardCondition" NOT NULL,
    "purchase_price" DECIMAL(12,2),
    "purchase_currency" TEXT,
    "purchase_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_prices" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "source" "PriceSource" NOT NULL,
    "variant" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "price" DECIMAL(12,4) NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" BIGSERIAL NOT NULL,
    "card_id" TEXT NOT NULL,
    "source" "PriceSource" NOT NULL,
    "variant" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "price" DECIMAL(12,4) NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" BIGSERIAL NOT NULL,
    "from_currency" TEXT NOT NULL,
    "to_currency" TEXT NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "target_price" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "sets_release_date_idx" ON "sets"("release_date");

-- CreateIndex
CREATE INDEX "cards_set_id_idx" ON "cards"("set_id");

-- CreateIndex
CREATE INDEX "cards_name_idx" ON "cards"("name");

-- CreateIndex
CREATE INDEX "cards_rarity_idx" ON "cards"("rarity");

-- CreateIndex
CREATE INDEX "user_cards_user_id_idx" ON "user_cards"("user_id");

-- CreateIndex
CREATE INDEX "user_cards_user_id_card_id_idx" ON "user_cards"("user_id", "card_id");

-- CreateIndex
CREATE INDEX "card_prices_captured_at_idx" ON "card_prices"("captured_at");

-- CreateIndex
CREATE UNIQUE INDEX "card_prices_card_id_source_variant_key" ON "card_prices"("card_id", "source", "variant");

-- CreateIndex
CREATE INDEX "price_history_card_id_recorded_at_idx" ON "price_history"("card_id", "recorded_at");

-- CreateIndex
CREATE INDEX "price_history_recorded_at_idx" ON "price_history"("recorded_at");

-- CreateIndex
CREATE INDEX "exchange_rates_from_currency_to_currency_captured_at_idx" ON "exchange_rates"("from_currency", "to_currency", "captured_at");

-- CreateIndex
CREATE INDEX "wishlists_user_id_idx" ON "wishlists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_user_id_card_id_key" ON "wishlists"("user_id", "card_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_cards" ADD CONSTRAINT "user_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_prices" ADD CONSTRAINT "card_prices_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
