import { redis } from '../config/redis';
import { withOptimisticLock } from './withOptimisticLock';
import { RateLimiter, RateLimitResult } from './RateLimiter';

export interface SlidingWindowCounterOptions {
  windowSeconds: number;
  limit: number;
}

const MAX_RETRIES = 20;

export class SlidingWindowCounterLimiter implements RateLimiter {
  readonly algorithm = 'sliding-window-counter';

  constructor(private readonly opts: SlidingWindowCounterOptions) {}

  async consume(key: string): Promise<RateLimitResult> {
    const { windowSeconds, limit } = this.opts;

    // We watch the *current* window's key specifically — that's the only
    // key this request could possibly write to, so it's the only one that
    // needs to be race-free. The previous window's count is read-only from
    // this request's point of view.
    const [serverTimeSec] = await redis.time();
    const now = Number(serverTimeSec);
    const currentWindowId = Math.floor(now / windowSeconds);
    const previousWindowId = currentWindowId - 1;

    const currentKey = `ratelimit:sw:${key}:${currentWindowId}`;
    const previousKey = `ratelimit:sw:${key}:${previousWindowId}`;

    return withOptimisticLock(currentKey, MAX_RETRIES, async (tx, conn) => {
      const [currentStr, previousStr] = await Promise.all([
        conn.get(currentKey),
        conn.get(previousKey),
      ]);
      const currentCount = currentStr !== null ? Number(currentStr) : 0;
      const previousCount = previousStr !== null ? Number(previousStr) : 0;

      const elapsedInCurrent = now - currentWindowId * windowSeconds;
      const weight = (windowSeconds - elapsedInCurrent) / windowSeconds;
      const estimated = previousCount * weight + currentCount;

      if (estimated >= limit) {
        // Nothing to write — but we still need to run an EXEC on this
        // connection to release the WATCH cleanly. INCRBY 0 is a no-op
        // write that lets the transaction commit normally.
        tx.incrby(currentKey, 0);
        return {
          allowed: false,
          limit,
          remaining: 0,
          retryAfterSeconds: windowSeconds,
        } as RateLimitResult;
      }

      tx.incr(currentKey);
      tx.expire(currentKey, windowSeconds * 2);

      const newCount = currentCount + 1;
      return {
        allowed: true,
        limit,
        remaining: Math.max(0, limit - newCount),
      } as RateLimitResult;
    });
  }
}
