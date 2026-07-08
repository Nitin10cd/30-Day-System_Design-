import IORedis from 'ioredis';
import { env } from './env';

export const redisConnectionOptions = {
  host: env.redisHost,
  port: env.redisPort,
  maxRetriesPerRequest: null as null,
};

export const redis = new IORedis(redisConnectionOptions);