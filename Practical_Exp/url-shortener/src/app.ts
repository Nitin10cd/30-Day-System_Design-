import express, { Express } from 'express';
import { authRouter } from './routes/auth.routes';
import { urlRouter } from './routes/url.routes';
import { statsRouter } from './routes/stats.routes';

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.set('trust proxy', true);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/', authRouter);
  app.use('/', statsRouter);
  app.use('/', urlRouter); // keep last: has catch-all "/:code"

  return app;
}