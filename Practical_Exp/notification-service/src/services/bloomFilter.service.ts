import { redis } from "../config/redis.";

const BIT_SIZE = 1_000_000; // ~125KB per campaign bitset - tune to expected audience size
const HASH_COUNT = 5;       // more hashes = fewer false positives, more Redis round trips

function hash(str: string, seed: number): number {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % BIT_SIZE;
}

function bitPositions(item: string): number[] {
  const positions: number[] = [];
  for (let i = 0; i < HASH_COUNT; i++) positions.push(hash(item, i * 7919));
  return positions;
}

export class BloomFilterService {
  static keyFor(campaignId: string): string {
    return `bloom:campaign:${campaignId}`;
  }

  /** Marks an item as seen. Call AFTER deciding to actually send. */
  static async add(campaignId: string, item: string): Promise<void> {
    const key = this.keyFor(campaignId);
    const pipeline = redis.pipeline();
    for (const pos of bitPositions(item)) pipeline.setbit(key, pos, 1);
    await pipeline.exec();
  }

  /**
   * false -> DEFINITELY not seen, safe to send.
   * true  -> PROBABLY already sent (small false-positive rate), skip.
   */
  static async mightContain(campaignId: string, item: string): Promise<boolean> {
    const key = this.keyFor(campaignId);
    const pipeline = redis.pipeline();
    for (const pos of bitPositions(item)) pipeline.getbit(key, pos);
    const results = await pipeline.exec();
    return (results ?? []).every(([err, bit]) => !err && bit === 1);
  }
}