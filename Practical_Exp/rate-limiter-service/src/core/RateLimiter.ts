export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds the client should wait before retrying, only set when denied */
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  /** Unique name, used in response headers / logging */
  readonly algorithm: string;

  /**
   * Consume one "request" against the given key (e.g. `user:42`, `ip:1.2.3.4`).
   * Must be safe to call concurrently from many app instances against the
   * same Redis — that's the whole point.
   */
  consume(key: string): Promise<RateLimitResult>;
}
