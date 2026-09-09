# Carteira Pokémon TCG

Plataforma mobile de gestão, acompanhamento e análise de coleções Pokémon TCG.

## Stack

- **Mobile:** React Native + Expo + TypeScript + NativeWind + Zustand + TanStack Query
- **API:** NestJS + Prisma + PostgreSQL + JWT
- **Worker:** Node + BullMQ + Redis
- **Infra:** Docker Compose (local), Turborepo + pnpm

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose
- Expo Go no celular (para testar o mobile)

## Setup inicial

```bash
# Instalar dependências
pnpm install

# Copiar variáveis de ambiente
cp .env.example .env

# Subir banco e Redis
pnpm db:up

# Rodar migrations
pnpm --filter @pkmn/api prisma migrate dev

# (Opcional) Popular catálogo mínimo
pnpm --filter @pkmn/worker sync:catalog
```

## Desenvolvimento

```bash
# Rodar tudo (API + mobile + worker) em paralelo
pnpm dev

# Ou individualmente
pnpm --filter @pkmn/api dev
pnpm --filter @pkmn/mobile dev
pnpm --filter @pkmn/worker dev
```

## Estrutura

- `apps/api` — API REST (NestJS)
- `apps/worker` — jobs de sincronização e preços
- `apps/mobile` — app React Native
- `packages/types` — tipos compartilhados
- `packages/validation` — schemas Zod compartilhados
- `packages/config` — configurações compartilhadas (ESLint, tsconfig)

## Testando o mobile

- **Emulador Android:** trocar `localhost` por `10.0.2.2` em `EXPO_PUBLIC_API_URL`
- **Dispositivo físico:** usar IP da máquina na rede local (ex: `http://192.168.1.10:3333`)
- **Simulador iOS:** `localhost` funciona
