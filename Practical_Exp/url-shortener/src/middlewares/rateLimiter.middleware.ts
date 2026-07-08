import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 30;

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const key = `ratelimit:${req.ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, WINDOW_SECONDS);

  if (count > MAX_REQUESTS) {
    res.status(429).json({ error: 'too_many_requests' });
    return;
  }
  next();
}