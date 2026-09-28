import { runSnapshotPrices } from '../jobs/snapshot-prices.js';
import { logger } from '../infra/logger.js';

runSnapshotPrices()
  .then(() => {
    logger.info('Script snapshot-prices finalizado');
    process.exit(0);
  })
  .catch((err) => {
    logger.error({ err }, 'Erro no snapshot-prices');
    process.exit(1);
  });
