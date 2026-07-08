import { Request, Response, NextFunction } from 'express';
import { RateLimiter } from '../core/RateLimiter';
import { OptimisticLockContentionError } from '../core/withOptimisticLock';

export type KeyStrategy = (req: Request) => string;

/** Default: rate limit per client IP. Swap this for per-user, per-API-key, etc. */
export const byIp: KeyStrategy = (req) => `ip:${req.ip}`;

export function rateLimiterMiddleware(limiter: RateLimiter, keyFn: KeyStrategy = byIp) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = keyFn(req);
      const result = await limiter.consume(key);

      res.setHeader('X-RateLimit-Algorithm', limiter.algorithm);
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);

      if (!result.allowed) {
        if (result.retryAfterSeconds) {
          res.setHeader('Retry-After', result.retryAfterSeconds);
        }
        res.status(429).json({
          error: 'too_many_requests',
          algorithm: limiter.algorithm,
          retryAfterSeconds: result.retryAfterSeconds,
        });
        return;
      }

      next();
    } catch (err) {
      if (err instanceof OptimisticLockContentionError) {
        // We genuinely don't know if this request was within the limit —
        // too many concurrent requests kept colliding on the same key to
        // find out. Failing OPEN here would mean "enough simultaneous
        // traffic defeats the rate limiter," which defeats the purpose.
        // Fail closed instead.
        res.status(429).json({ error: 'too_many_requests', reason: 'high_contention' });
        return;
      }

      // Any other error here means Redis itself is unreachable/erroring.
      // Fail-open: don't take the whole API down because Redis had a blip.
      // Fail-closed is safer against abuse but riskier for availability —
      // pick based on what you're protecting. Logged either way.
      console.error('[rateLimiter] Redis error, failing open:', err);
      next();
    }
  };
}
