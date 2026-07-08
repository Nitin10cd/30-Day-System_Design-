# Rate Limiter Service — Practical Implementation

## Table of Contents

1. What We Built
2. Why a Single-Node Counter Doesn't Work
3. Tech Stack
4. Project Structure
5. The Algorithms
6. How Atomicity Actually Works (WATCH / MULTI / EXEC)
7. The Real Cost of This Approach
8. Running It
9. Proving Cross-Instance Consistency Under Concurrency
10. API Reference
11. What We Observed
12. Key Learnings

---

# What We Built

A rate limiter that stays correct no matter how many copies of your API are
running behind a load balancer — implemented entirely with Node.js/TypeScript
and Redis, using nothing but `ioredis`'s own API (no Lua, no separate script
language). Three real algorithms, each made race-safe with Redis's built-in
optimistic-locking pattern (`WATCH` / `MULTI` / `EXEC`), wired up behind an
Express middleware, plus a docker-compose that boots **3 separate app
instances behind nginx** so you can watch the limit hold even though no
single process ever sees every request.

```text
Token Bucket              — smooth rate + allows short bursts
Sliding Window Counter    — good approximation, O(1) memory, no boundary burst
Sliding Window Log        — exact accounting, higher memory cost
Fixed Window (naive)      — kept only for comparison, has a boundary-burst bug
```

---

# Why a Single-Node Counter Doesn't Work

If you rate limit with a plain JS variable (`let count = 0`) or an in-memory
`Map`, that counter only exists inside *one* process's memory. The moment
you run more than one instance of your API — which you will, for any real
traffic — each instance has its own counter. A client can get the full
limit from instance A, then immediately get the full limit again from
instance B, and again from C. Your "100 requests/minute" limit quietly
becomes "100 × number of instances".

The fix is to move the counter somewhere all instances share: Redis. But
that introduces a new problem — moving state to a shared store doesn't
automatically make it *safe under concurrency*. If two instances both `GET`
a value, both decide "under the limit" in JS, then both `SET`, you can still
let through more than the limit, because "read, decide, write" wasn't
atomic. That's the actual bug this project fixes.

---

# Tech Stack

```text
Runtime      Node.js
Framework    Express.js
Store        Redis (ioredis client — plain API, no Lua/EVAL)
Atomicity    Redis WATCH / MULTI / EXEC (optimistic locking, driven from TS)
Demo infra   docker-compose: redis + 3 api instances + nginx load balancer
```

---

# Project Structure

```text
rate-limiter-service/
  |
  +---- src/
  |       |
  |       +---- config/
  |       |        +---- env.ts
  |       |        +---- redis.ts                Plain ioredis client
  |       |
  |       +---- core/
  |       |        +---- RateLimiter.ts           shared interface
  |       |        +---- withOptimisticLock.ts     WATCH/MULTI/EXEC helper (the atomicity)
  |       |        +---- TokenBucketLimiter.ts
  |       |        +---- SlidingWindowCounterLimiter.ts
  |       |        +---- SlidingWindowLogLimiter.ts
  |       |        +---- FixedWindowLimiter.ts     naive version, for comparison
  |       |
  |       +---- middlewares/
  |       |        +---- rateLimiter.middleware.ts  wraps any RateLimiter as Express middleware
  |       |
  |       +---- controllers/demo.controller.ts
  |       +---- routes/demo.routes.ts
  |       +---- app.ts
  |       +---- server.ts
  |
  +---- docker-compose.yml     redis + api1 + api2 + api3 + nginx
  +---- nginx.conf             round-robin load balancer
  +---- Dockerfile
```

---

# The Algorithms

## Fixed Window (naive — what most people write first)

`INCR key`, `EXPIRE key windowSeconds`. Simple, and `INCR` itself is atomic
in Redis, so the counter can't be corrupted. The bug is algorithmic, not a
race condition: the window has no memory of the window before it. A client
can send the full limit in the last millisecond of window N, then the full
limit again in the first millisecond of window N+1 — 2x the limit in
practically no time. This is what `url-shortener/src/middlewares/rateLimiter.middleware.ts`
in your other project does today.

## Token Bucket

A bucket holds up to `capacity` tokens and refills at `refillRatePerSec`.
Each request costs 1 token (configurable). Reach for this when you want to
**allow bursts** but cap the **sustained** rate — e.g. "up to 10 requests
immediately, then steady at 2/sec after that." Very common for public APIs.

## Sliding Window Counter

Keeps two fixed-window buckets (current + previous) and blends them by how
far you are into the current window. Fixes the fixed-window boundary-burst
problem with O(1) memory per key — it's an approximation, not exact, but
cheap and accurate enough for almost every real use case.

## Sliding Window Log

Stores every request's timestamp in a Redis sorted set, evicts anything
outside the window, counts what's left. Exact — no approximation, no
boundary burst — but memory scales with request volume within the window.
Reach for this when precision actually matters (billing-adjacent limits),
not for high-volume public endpoints.

---

# How Atomicity Actually Works (WATCH / MULTI / EXEC)

Every algorithm needs a "read state → decide → write state" sequence. Doing
that as separate Redis calls from Node leaves a window where two instances
can both read the same state before either writes.

Redis has a built-in optimistic-locking pattern for exactly this, entirely
through normal commands — no separate scripting language:

```text
WATCH key      -> "tell me if this key changes before I commit"
...read the key's current value, decide what to do, all in plain JS...
MULTI          -> start queuing a transaction
...queue the write commands...
EXEC           -> try to commit. Redis aborts (returns null) if `key`
                  was modified by ANYONE between the WATCH and this EXEC.
```

If `EXEC` returns `null`, nothing was written — someone else won the race.
The code re-reads the (now up-to-date) value and tries again. This is the
same compare-and-swap pattern you'd use with an optimistic-locked row in
Postgres (`WHERE version = ?`), just against a Redis key instead of a SQL
row.

This whole thing is implemented once, generically, in
`src/core/withOptimisticLock.ts`, and each limiter just supplies "how to
read + decide + queue the write" as a callback.

**One real gotcha this project ran into and fixes:** `WATCH`/`MULTI`/`EXEC`
state lives on a single Redis *connection*, not per logical request. If
every request reused one shared `ioredis` client, two concurrent requests'
`WATCH` calls could interfere with each other on the same socket. So every
transaction attempt runs on its own short-lived duplicated connection
(`redis.duplicate()`), closed when done.

---

# The Real Cost of This Approach

This isn't free, and it's worth being honest about the trade-off versus a
Lua script (Redis's other standard tool for this — a script is treated as
one atomic command server-side, so it doesn't need retries or a dedicated
connection at all):

- **Retries under contention.** If many requests hit the *same* rate-limit
  key at the same instant (e.g. one heavily-used API key, or an IP getting
  hammered), several of them will lose the `EXEC` race and have to retry.
  This project adds jittered backoff between retries and caps it at 20
  attempts.
- **A dedicated connection per attempt.** `WATCH` requires its own
  connection, so each attempt opens (and closes) a duplicated `ioredis`
  connection. Cheap, but not free — it's real socket setup/teardown, unlike
  a Lua script which runs on the connection you already have.
- **What happens when retries run out.** Early on while building this, the
  middleware's Redis-error handling was "fail open" (let the request
  through) for *any* thrown error — including retry exhaustion. Under a
  30-way concurrent burst against a limit of 10, that let through 21
  requests, because contention-exhausted attempts were being treated the
  same as "Redis is down." Fixed by giving contention exhaustion its own
  error type (`OptimisticLockContentionError`) and failing **closed**
  (deny, 429) for that specific case, while still failing open for genuine
  Redis connectivity errors. Real bug, caught by testing under actual
  concurrency — worth knowing this is an easy mistake to make with this
  pattern.

If you outgrow this (very high contention on individual keys, or you want
to shave off the retry/connection overhead), a small Lua script is the
standard next step — same logic, one round trip, no retries needed. Kept
out of this version on purpose to stay inside plain Node/TS + `ioredis`.

---

# Running It

## Locally (single instance, for development)

```bash
cp .env.example .env
npm install
npm run dev
```

Requires Redis running locally (`redis-server`, or `docker run -p 6379:6379 redis:7-alpine`).

## Multi-instance, via Docker (the actual point of this project)

```bash
docker compose up --build
```

This starts Redis, three separate API containers (`api1`, `api2`, `api3`,
each with its own `INSTANCE_ID`), and nginx round-robining across all three
on `http://localhost:8080`.

---

# Proving Cross-Instance Consistency Under Concurrency

The interesting test isn't sequential requests — a single-node counter can
often fake correctness there. It's firing requests **concurrently** at
**separate processes** sharing one Redis:

```bash
# 30 concurrent requests, limit is 10
seq 1 30 | xargs -P 30 -I{} curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:8080/demo/sliding-window | sort | uniq -c
```

I ran this exact shape of test while building this, both against a single
instance and split across two independent `node` processes on different
ports (no Docker, just two servers sharing one Redis), firing 30 truly
concurrent requests via `xargs -P 30` at a limit of 10:

```text
10 200
20 429
```

Exactly 10 allowed, every time, across repeated runs — whether all 30 hit
one process or were split across two. That's the whole exercise, actually
working under the conditions that break a naive implementation.

---

# API Reference

All demo endpoints live under `/demo` and are limited **per client IP**
(`byIp` key strategy in `rateLimiter.middleware.ts` — swap in a per-user or
per-API-key strategy trivially, it's just a `(req) => string` function).

| Endpoint                | Algorithm               | Limit                  |
|--------------------------|--------------------------|--------------------------|
| `GET /demo/token-bucket` | Token bucket             | burst 10, refill 2/sec  |
| `GET /demo/sliding-window` | Sliding window counter | 10 per 10s              |
| `GET /demo/sliding-log`  | Sliding window log       | 10 per 10s              |
| `GET /demo/fixed-window` | Fixed window (naive)     | 10 per 10s              |

Every response includes:

```text
X-RateLimit-Algorithm: <name>
X-RateLimit-Limit: <n>
X-RateLimit-Remaining: <n>
Retry-After: <seconds>     (only on 429, when known)
```

Denied requests return `429`:

```json
{ "error": "too_many_requests", "algorithm": "token-bucket", "retryAfterSeconds": 1 }
```

or, under extreme contention specifically:

```json
{ "error": "too_many_requests", "reason": "high_contention" }
```

---

# What We Observed

- Sequential hammering (15 requests, limit 10): exactly 10 succeed, the
  rest get `429` — for all four algorithms, including the naive one.
- **Concurrent** hammering (30 requests fired at once via `xargs -P 30`,
  limit 10): exactly 10 succeed for the sliding window counter and sliding
  window log. Token bucket allowed 10 (occasionally 11, when real elapsed
  time during contention retries legitimately refilled a fraction of a
  token — that's correct token-bucket behavior, not a bug).
- The first version of the contention-exhaustion handling had a real bug:
  it fail-opened on retry exhaustion the same as a Redis outage, letting
  21/30 concurrent requests through against a limit of 10. Caught by
  testing under real concurrency, not by reasoning about the code.
- The naive fixed-window version behaves identically to the proper ones
  *under a steady hammer* — its bug only shows up right at a window
  boundary, which is exactly why it's easy to ship without noticing.

---

# Key Learnings

- Rate limiting is a distributed-systems problem the moment you have more
  than one app instance — it's not really about the algorithm math until
  the state is shared correctly first.
- "Shared state in Redis" isn't automatically "safe under concurrency."
  Atomicity has to be explicit — `WATCH`/`MULTI`/`EXEC` is Redis's
  plain-command answer to that; Lua is the alternative if you want it in
  one round trip instead of a retry loop.
- Don't trust per-instance clocks for anything time-window-based across a
  fleet; ask the shared store (Redis `TIME`) instead.
- "Fail open on error" needs to distinguish *why* the error happened.
  Failing open because Redis is down is a reasonable availability
  trade-off. Failing open because your own retry budget got exhausted
  under load quietly turns off the rate limiter exactly when traffic is
  high enough to need it.
- Algorithm choice is a genuine tradeoff, not a "which is best" question:
  fixed window is cheap but buggy at boundaries, sliding window counter is
  the sane default, sliding window log is exact but costs memory, token
  bucket is what you want when bursts should be allowed.
