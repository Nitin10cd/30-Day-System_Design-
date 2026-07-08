import { redis } from '../config/redis';
import { RateLimiter, RateLimitResult } from './RateLimiter';

export interface FixedWindowOptions {
  windowSeconds: number;
  limit: number;
}

/**
 * This is basically what url-shortener/src/middlewares/rateLimiter.middleware.ts
 * does today: plain INCR + EXPIRE. It's kept here on purpose, not because
 * it's recommended, but so the /demo/fixed-window route can sit next to
 * /demo/sliding-window and you can literally watch the boundary-burst
 * problem happen (hammer both right as a window rolls over).
 *
 * The INCR itself is atomic, so this doesn't have a race condition on the
 * counter — the problem is purely algorithmic: a fixed window has no memory
 * of the window before it, so 2x the limit can slip through right at the
 * boundary.
 */
export class FixedWindowLimiter implements RateLimiter {
  readonly algorithm = 'fixed-window (naive)';

  constructor(private readonly opts: FixedWindowOptions) {}

  async consume(key: string): Promise<RateLimitResult> {
    const { windowSeconds, limit } = this.opts;
    const redisKey = `ratelimit:fw:${key}`;

    const count = await redis.incr(redisKey);
    if (count === 1) await redis.expire(redisKey, windowSeconds);

    const remaining = Math.max(0, limit - count);

    if (count <= limit) {
      return { allowed: true, limit, remaining };
    }

    const ttl = await redis.ttl(redisKey);
    return { allowed: false, limit, remaining: 0, retryAfterSeconds: Math.max(ttl, 1) };
  }
}
