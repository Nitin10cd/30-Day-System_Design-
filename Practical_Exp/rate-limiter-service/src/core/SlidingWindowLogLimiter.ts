import { redis } from '../config/redis';
import { withOptimisticLock } from './withOptimisticLock';
import { RateLimiter, RateLimitResult } from './RateLimiter';

export interface SlidingWindowLogOptions {
  windowMs: number;
  limit: number;
}

const MAX_RETRIES = 20;

export class SlidingWindowLogLimiter implements RateLimiter {
  readonly algorithm = 'sliding-window-log';

  constructor(private readonly opts: SlidingWindowLogOptions) {}

  async consume(key: string): Promise<RateLimitResult> {
    const { windowMs, limit } = this.opts;
    const redisKey = `ratelimit:log:${key}`;

    return withOptimisticLock(redisKey, MAX_RETRIES, async (tx, conn) => {
      const [timeSec, timeMicro] = await conn.time();
      const now = Number(timeSec) * 1000 + Math.floor(Number(timeMicro) / 1000);
      const clearBefore = now - windowMs;

      // Read-only count of members still inside the window. ZCOUNT doesn't
      // mutate anything, so it's safe to call before deciding — the
      // eviction of expired members happens in the transaction below,
      // alongside the write, so it can't race with another request's
      // eviction.
      const count = await conn.zcount(redisKey, clearBefore, '+inf');

      if (count >= limit) {
        tx.zremrangebyscore(redisKey, 0, clearBefore);
        return {
          allowed: false,
          limit,
          remaining: 0,
          retryAfterSeconds: Math.ceil(windowMs / 1000),
        } as RateLimitResult;
      }

      const member = `${now}-${Math.random()}`;
      tx.zremrangebyscore(redisKey, 0, clearBefore);
      tx.zadd(redisKey, now, member);
      tx.expire(redisKey, Math.ceil(windowMs / 1000) + 1);

      return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - (count + 1)),
      } as RateLimitResult;
    });
  }
}
