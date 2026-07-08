export const env = {
  port: Number(process.env.PORT ?? 4000),
  instanceId: process.env.INSTANCE_ID ?? `local-${process.pid}`,
  redisHost: process.env.REDIS_HOST ?? '127.0.0.1',
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
};
