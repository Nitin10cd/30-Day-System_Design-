import { redis } from '../config/redis';
import type { Redis } from 'ioredis';

/**
 * Redis's answer to "read, decide, write" without a race condition, using
 * nothing but plain ioredis calls (no Lua, no separate script language).
 *
 * WATCH key        -> "tell me if this key changes before I commit"
 * ...read + decide in normal JS...
 * MULTI / EXEC     -> queue the write, try to commit it atomically
 *
 * If another client modified the watched key between WATCH and EXEC,
 * Redis aborts the transaction and exec() returns null — nothing was
 * written. That's the signal to re-read the (now up-to-date) state and
 * try again. This is the same compare-and-swap pattern you'd use with an
 * optimistic-locked row in Postgres, just against a Redis key instead.
 *
 * IMPORTANT gotcha this fixes: WATCH/MULTI/EXEC state lives on a single
 * Redis *connection*, not per logical request. If two concurrent requests
 * shared one ioredis client, one request's WATCH could get clobbered by
 * another request's WATCH/EXEC happening on the same connection in
 * between. So every attempt here runs on its own short-lived duplicated
 * connection (`redis.duplicate()`), which ioredis makes cheap — it reuses
 * the same connection options, it's just a separate TCP socket. We close
 * it when we're done. This is the real cost of doing this without Lua:
 * an extra connection per contended attempt, vs. Lua's single round trip
 * on the existing connection.
 *
 * `build(tx)` receives a fresh `multi()` transaction each retry. Your
 * callback reads current state (already done before calling this helper),
 * decides what to do, queues writes on `tx`, and returns whatever result
 * you want back. If the commit fails due to contention, everything re-runs
 * from scratch — including the read — since the state may have changed.
 */
/**
 * Thrown when we exhausted retries because other requests kept winning the
 * race on the same key — NOT because Redis is unreachable. Callers should
 * treat this differently from a connectivity error: under heavy contention
 * on a rate-limit key, the safe default is to deny the request (we don't
 * know if it was actually within the limit), not to let it through.
 */
export class OptimisticLockContentionError extends Error {
  constructor(watchKey: string, attempts: number) {
    super(`gave up after ${attempts} attempts on "${watchKey}" (too much contention)`);
    this.name = 'OptimisticLockContentionError';
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withOptimisticLock<T>(
  watchKey: string,
  maxAttempts: number,
  build: (tx: ReturnType<Redis['multi']>, conn: Redis) => Promise<T>
): Promise<T> {
  const conn = redis.duplicate();

  try {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await conn.watch(watchKey);

      const tx = conn.multi();
      let result: T;
      try {
        result = await build(tx, conn);
      } catch (err) {
        await conn.unwatch();
        throw err;
      }

      const execResult = await tx.exec();

      if (execResult !== null) {
        // Commit succeeded — nobody touched watchKey while we were deciding.
        return result;
      }

      // Someone else committed first. Back off a little with jitter before
      // retrying — without this, a burst of concurrent requests on the same
      // key tends to all wake up and retry at once, collide again, and
      // burn through maxAttempts as a group instead of resolving quickly.
      await sleep(Math.random() * 5 * (attempt + 1));
    }

    throw new OptimisticLockContentionError(watchKey, maxAttempts);
  } finally {
    conn.disconnect();
  }
}
