import express from 'express';
import { demoRouter } from './routes/demo.routes';
import { env } from './config/env';

export function createApp() {
  const app = express();
  // We sit behind nginx in docker-compose — without this, req.ip would
  // resolve to nginx's IP for every client, and everyone would share one
  // rate-limit bucket.
  app.set('trust proxy', true);
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, instance: env.instanceId });
  });

  app.use('/demo', demoRouter);

  return app;
}
