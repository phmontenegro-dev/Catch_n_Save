import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from '../infra/logger.js';
import { runSyncCatalog } from '../jobs/sync-catalog.js';
import { runSnapshotPrices } from '../jobs/snapshot-prices.js';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const syncCatalogQueue = new Queue('sync-catalog', { connection });
export const snapshotPricesQueue = new Queue('snapshot-prices', { connection });

export async function startQueues() {
  new Worker(
    'sync-catalog',
    async (job) => {
      logger.info({ jobId: job.id }, 'Iniciando sync do catálogo');
      await runSyncCatalog();
      logger.info({ jobId: job.id }, 'Sync do catálogo concluído');
    },
    { connection },
  );

  new Worker(
    'snapshot-prices',
    async (job) => {
      logger.info({ jobId: job.id }, 'Iniciando snapshot de preços');
      await runSnapshotPrices();
      logger.info({ jobId: job.id }, 'Snapshot de preços concluído');
    },
    { connection },
  );

  logger.info('Filas registradas');
}
