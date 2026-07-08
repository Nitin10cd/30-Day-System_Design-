import { Router } from 'express';
import { rateLimiterMiddleware } from '../middlewares/rateLimiter.middleware';
import { demoHandler } from '../controllers/demo.controller';
import { TokenBucketLimiter } from '../core/TokenBucketLimiter';
import { SlidingWindowCounterLimiter } from '../core/SlidingWindowCounterLimiter';
import { SlidingWindowLogLimiter } from '../core/SlidingWindowLogLimiter';
import { FixedWindowLimiter } from '../core/FixedWindowLimiter';

export const demoRouter = Router();

// Burst of up to 10, sustained refill of 2 tokens/sec (~120 req/min steady state)
const tokenBucket = new TokenBucketLimiter({ capacity: 10, refillRatePerSec: 2 });

// 10 requests per 10-second window, no boundary burst
const slidingWindow = new SlidingWindowCounterLimiter({ windowSeconds: 10, limit: 10 });

// Same limit, exact accounting (costs more memory)
const slidingLog = new SlidingWindowLogLimiter({ windowMs: 10_000, limit: 10 });

// Same limit as the others, naive algorithm — for comparison only
const fixedWindow = new FixedWindowLimiter({ windowSeconds: 10, limit: 10 });

demoRouter.get('/token-bucket', rateLimiterMiddleware(tokenBucket), demoHandler('token-bucket'));
demoRouter.get(
  '/sliding-window',
  rateLimiterMiddleware(slidingWindow),
  demoHandler('sliding-window-counter')
);
demoRouter.get(
  '/sliding-log',
  rateLimiterMiddleware(slidingLog),
  demoHandler('sliding-window-log')
);
demoRouter.get(
  '/fixed-window',
  rateLimiterMiddleware(fixedWindow),
  demoHandler('fixed-window (naive)')
);
