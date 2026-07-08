import { Router } from 'express';
import { getUrlStats } from '../controllers/stats.controller';

export const statsRouter = Router();
statsRouter.get('/stats/:code', getUrlStats);