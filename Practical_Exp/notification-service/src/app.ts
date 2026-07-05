import express, { Express } from 'express';
import { notificationRouter } from './routes/notification.routes';
import { userRouter } from './routes/user.routes';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/', userRouter);
  app.use('/', notificationRouter);

  return app;
}