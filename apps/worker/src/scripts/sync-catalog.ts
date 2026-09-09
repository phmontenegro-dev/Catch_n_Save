import { runSyncCatalog } from '../jobs/sync-catalog.js';
import { logger } from '../infra/logger.js';

runSyncCatalog()
  .then(() => {
    logger.info('Script sync-catalog finalizado');
    process.exit(0);
  })
  .catch((err) => {
    logger.error({ err }, 'Erro no sync-catalog');
    process.exit(1);
  });
