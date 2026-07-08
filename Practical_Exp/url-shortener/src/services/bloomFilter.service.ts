import { redis } from '../config/redis';

const BIT_SIZE = 10_000_000;
const HASH_COUNT = 5;
const KEY = 'bloom:shortcodes';

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
  static async add(code: string): Promise<void> {
    const pipeline = redis.pipeline();
    for (const pos of bitPositions(code)) pipeline.setbit(KEY, pos, 1);
    await pipeline.exec();
  }

  static async mightContain(code: string): Promise<boolean> {
    const pipeline = redis.pipeline();
    for (const pos of bitPositions(code)) pipeline.getbit(KEY, pos);
    const results = await pipeline.exec();
    return (results ?? []).every(([err, bit]) => !err && bit === 1);
  }
}