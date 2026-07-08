# URL Shortener — System Design Project

A scalable URL shortener built with **Node.js, Express, TypeScript, PostgreSQL (Prisma), Redis, Kafka, and MongoDB**. Designed to demonstrate real system-design tradeoffs: decoupled analytics, non-guessable short codes, and independently scalable components — not just a CRUD app.

---

## Architecture

```
User <--> API <--> Postgres (source of truth: shortCode -> longUrl, users)
                |
                | (on every visit, async, non-blocking)
                v
              Kafka  ---->  Consumer (worker)  ---->  MongoDB (click stats)
                                                       [os, agent, referrer, time]

Redis: bloom filter (short code collision check) + rate limiter
```

**Core idea:** redirecting a user must be fast and must never wait on analytics. So the redirect path only touches Postgres (a single indexed lookup); everything else (click logging, stats) happens asynchronously through Kafka, off the request's critical path.

---

## Why each piece of tech is there

| Component | Role | Why this and not something else |
|---|---|---|
| **PostgreSQL + Prisma** | Stores users and the `shortCode → longUrl` mapping | Needs strong consistency and a real **unique constraint** on `shortCode` — this is the final safety net against collisions. Relational (`User` ↔ `Url`) fits naturally. |
| **MongoDB** | Stores individual click events (raw analytics log) | Click events are effectively unstructured/evolving (os, referrer, geo, device — fields can grow later without migrations), and reads are mostly **aggregations** (count by day, count by OS), which Mongo's pipeline handles well. |
| **Kafka** | Decouples "redirect the user" from "record the click" | Absorbs traffic bursts; the consumer (worker) can scale independently of the API. If Mongo is slow/down, redirects still work — events just wait in the topic. |
| **Redis** | (1) Bloom filter for short-code collision checks, (2) rate limiting `/shorten` | Both are O(1) in-memory operations — far cheaper than hitting Postgres on every code-generation attempt or every request. |
| **JWT + bcrypt** | User auth | Stateless auth (no server-side session store) — fits the "stateless API, horizontally scalable" goal. |

---

## Short code generation (the core algorithm)

Requirement: **fast, collision-safe, and non-guessable** (no sequential IDs, no predictable pattern).

1. Generate a random 7-character code from `[A-Za-z0-9]` using `crypto.randomInt` (cryptographically secure, unbiased) — **not** an incrementing counter, which would be enumerable/guessable.
2. Keyspace: `62^7 ≈ 3.5 trillion` combinations → collision probability is negligible even at large scale.
3. Before touching Postgres, check a **Bloom filter in Redis** (`mightContain`) — O(1), no DB round trip for the common case where the code is definitely free.
4. If the Bloom filter says "maybe exists" (rare, and can be a false positive), fall back to a direct Postgres lookup to confirm.
5. Postgres's `@unique` constraint on `shortCode` is the last-resort guard — if a true collision somehow occurs, the insert fails and a new code is generated (retry loop, capped at 5 attempts).

This is why it's efficient (Bloom filter avoids DB hits) **and** safe (unique constraint + crypto-random, never guessable).

---

## Request flow

### 1. Create short URL — `POST /shorten`
```
Client -> validate body (zod) -> generate/verify short code -> insert into Postgres -> return shortUrl
```
Synchronous end-to-end — the client needs the short URL immediately, so there's no reason to make this async.

### 2. Visit short URL — `GET /:code`
```
Client -> Postgres lookup (indexed, O(log n)) -> 302 redirect issued immediately
                                               -> (fire-and-forget) publish click event to Kafka
                                               -> (fire-and-forget) increment Postgres click counter
```
The `res.redirect()` call happens **before** the Kafka publish and counter increment — those are not awaited in the response path, so a slow Mongo/Kafka never delays the user's redirect.

### 3. Click event processing (background worker, separate process)
```
Kafka consumer (group: stats-consumer-group) -> parse event (os from user-agent) -> insert into MongoDB "clicks" collection
```
Runs via `npm run dev:worker`, independent of the API process — can be scaled to multiple worker instances without touching the API.

### 4. Stats — `GET /stats/:code`
```
MongoDB aggregation: total clicks, clicks by OS, clicks by day
```

---

## Folder structure

```
src/
  config/        env.ts, prisma.ts, redis.ts, kafka.ts, mongo.ts   — connection/singleton setup
  types/         *.schema.ts (zod validation), *.types.ts          — request shapes & event types
  services/      shortCode, bloomFilter, auth, url, stats          — business logic, DB-agnostic of routing
  producers/     click.producer.ts                                 — publishes to Kafka
  consumers/     click.consumer.ts                                 — subscribes from Kafka, writes to Mongo
  controllers/   url, auth, stats                                  — HTTP request/response handling only
  routes/        url, auth, stats                                  — route -> controller wiring
  middlewares/   auth (JWT), rateLimiter (Redis)
  app.ts         — Express app assembly
  server.ts      — API process entrypoint
  worker.ts      — Kafka consumer process entrypoint (run separately from the API)
prisma/schema.prisma  — Postgres schema (User, Url)
docker-compose.yml    — Postgres, Redis, MongoDB, Zookeeper, Kafka
```

Layering follows a strict separation: **routes** wire HTTP to **controllers**, controllers only handle req/res and delegate to **services**, services contain all business logic and are the only layer that talks to Prisma/Mongo/Redis/Kafka directly.

---

## Infra (Docker)

All five backing services run in Docker, on non-default ports to avoid clashing with anything already running locally:

| Service | Container port | Host port |
|---|---|---|
| PostgreSQL | 5432 | **5433** |
| Redis | 6379 | **6380** |
| MongoDB | 27017 | **27018** |
| Kafka | 9092 | 9092 |
| Zookeeper | 2181 | (internal only) |

```bash
docker compose up -d
docker ps   # confirm all 5 containers are Up
```

Connect with external tools:
- **psql:** `docker exec -it url-postgres psql -U postgres -d url_shortener`
- **MongoDB Compass:** `mongodb://localhost:27018`

---

## Database schema (Postgres)

```
User
 ├─ id, name, email (unique), password (bcrypt hash), createdAt
 └─ urls: Url[]

Url
 ├─ id, shortCode (unique), longUrl, userId (nullable — anonymous URLs allowed)
 ├─ clicks (running counter, cheap total — detailed breakdown lives in Mongo)
 ├─ isActive, expiresAt (soft-disable / expiry support)
 └─ createdAt
```

MongoDB `clicks` collection (schemaless, one document per visit):
```json
{
  "shortCode": "aB3xY9z",
  "timestamp": 1735689600000,
  "ip": "203.0.113.42",
  "userAgent": "Mozilla/5.0 ...",
  "os": "Windows",
  "referrer": "https://twitter.com",
  "createdAt": "2026-07-09T00:00:00.000Z"
}
```
Indexed on `{ shortCode: 1, timestamp: -1 }` for fast per-URL, time-ordered lookups.

---

## API endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a user account |
| POST | `/auth/login` | — | Get a JWT |
| POST | `/shorten` | Optional | Create a short URL (rate-limited, anonymous or logged-in) |
| GET | `/:code` | — | Redirect to the original URL; fires click event async |
| GET | `/stats/:code` | — | Aggregated click stats for a short URL |
| GET | `/health` | — | Health check |

---

## Running it

```bash
# 1. infra
docker compose up -d

# 2. tables
npx prisma migrate dev --name init

# 3. two terminals
npm run dev:api      # API server
npm run dev:worker   # Kafka consumer (background analytics writer)
```

`.env` required values:
```
PORT=3000
BASE_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/url_shortener"
REDIS_HOST=localhost
REDIS_PORT=6380
KAFKA_BROKERS=localhost:9092
KAFKA_CLICK_TOPIC=url-clicks
MONGO_URL=mongodb://localhost:27018
MONGO_DB=url_shortener_stats
JWT_SECRET=change_this_to_something_long_and_random
```

---

## Scalability notes

| Concern | How it's addressed |
|---|---|
| API horizontal scaling | Stateless (JWT, no server sessions) — run N instances behind a load balancer |
| Short-code collisions at scale | Crypto-random generation + Redis Bloom filter + Postgres unique constraint |
| Redirect latency | Never blocks on Kafka publish or Mongo write (fire-and-forget) |
| Analytics write bursts | Kafka buffers the load; consumer group scales independently of the API |
| Abuse / short-code guessing | 62^7 keyspace makes brute-forcing impractical; IP-based rate limiter on `/shorten` |
| Hot-URL read latency | Not yet added — next step is a Redis cache in front of `UrlService.resolve()` |

## Possible next improvements
- Redis cache for `resolve()` on frequently visited short codes (TTL-based)
- Geo-IP lookup to populate `country` in click events
- Refresh tokens / token revocation for auth
- Soft-delete / scheduled cleanup job for expired URLs
- Proper `ua-parser-js` instead of the regex-based OS detection in the consumer