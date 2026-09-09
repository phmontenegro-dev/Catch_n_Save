import { logger } from './infra/logger.js';
import { startQueues } from './queues/index.js';

async function main() {
  logger.info('🚀 Worker iniciando…');
  await startQueues();
  logger.info('✅ Worker pronto — aguardando jobs');
}

main().catch((err) => {
  logger.error({ err }, 'Falha ao iniciar worker');
  process.exit(1);
});

// Graceful shutdown
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    logger.info({ signal }, 'Recebido sinal, encerrando…');
    process.exit(0);
  });
}
