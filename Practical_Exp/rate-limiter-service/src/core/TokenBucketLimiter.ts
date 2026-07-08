import { withOptimisticLock } from './withOptimisticLock';
import { RateLimiter, RateLimitResult } from './RateLimiter';

export interface TokenBucketOptions {
  /** Max tokens the bucket holds = max burst size */
  capacity: number;
  /** Tokens refilled per second = sustained rate */
  refillRatePerSec: number;
  /** How many tokens a single request costs (default 1) */
  cost?: number;
}

const MAX_RETRIES = 20;

export class TokenBucketLimiter implements RateLimiter {
  readonly algorithm = 'token-bucket';

  constructor(private readonly opts: TokenBucketOptions) {}

  async consume(key: string): Promise<RateLimitResult> {
    const { capacity, refillRatePerSec, cost = 1 } = this.opts;
    const redisKey = `ratelimit:tb:${key}`;
    const ttlSeconds = Math.ceil(capacity / refillRatePerSec) * 4 || 60;

    return withOptimisticLock(redisKey, MAX_RETRIES, async (tx, conn) => {
      // Plain reads — no Lua, just ioredis calls. Server time (not
      // Date.now()) so every app instance agrees on "now" regardless of
      // local clock drift.
      const [serverTimeSec] = await conn.time(); // ['1720000000', '123456']
      const now = Number(serverTimeSec);

      const [tokensStr, lastStr] = await conn.hmget(redisKey, 'tokens', 'timestamp');
      let tokens = tokensStr !== null ? Number(tokensStr) : capacity;
      const last = lastStr !== null ? Number(lastStr) : now;

      const elapsed = Math.max(0, now - last);
      tokens = Math.min(capacity, tokens + elapsed * refillRatePerSec);

      let allowed = false;
      if (tokens >= cost) {
        tokens -= cost;
        allowed = true;
      }

      tx.hset(redisKey, { tokens: String(tokens), timestamp: String(now) });
      tx.expire(redisKey, ttlSeconds);

      if (allowed) {
        return { allowed: true, limit: capacity, remaining: Math.floor(tokens) } as RateLimitResult;
      }

      const tokensNeeded = cost - tokens;
      const retryAfterSeconds = Math.max(1, Math.ceil(tokensNeeded / refillRatePerSec));
      return {
        allowed: false,
        limit: capacity,
        remaining: Math.floor(tokens),
        retryAfterSeconds,
      } as RateLimitResult;
    });
  }
}
