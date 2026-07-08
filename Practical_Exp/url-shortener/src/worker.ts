import { startClickConsumer } from './consumers/click.consumer';

startClickConsumer().catch((err) => {
  console.error('[worker] failed to start consumer:', err);
  process.exit(1);
});