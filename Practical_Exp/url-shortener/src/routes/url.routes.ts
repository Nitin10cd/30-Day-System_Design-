import { Router } from 'express';
import { createShortUrl, redirectShortUrl } from '../controllers/url.controller';
import { optionalAuth } from '../middlewares/auth.middleware';
import { rateLimiter } from '../middlewares/rateLimiter.middleware';

export const urlRouter = Router();
urlRouter.post('/shorten', rateLimiter, optionalAuth, createShortUrl);
urlRouter.get('/:code', redirectShortUrl);