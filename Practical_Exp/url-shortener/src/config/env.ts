import dotenv from 'dotenv';
dotenv.config();

function required(name: string, fallback?: string): string {
  const val = process.env[name] ?? fallback;
  if (val === undefined) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  baseUrl: required('BASE_URL', 'http://localhost:3000'),

  databaseUrl: required('DATABASE_URL'),

  redisHost: required('REDIS_HOST', 'localhost'),
  redisPort: Number(process.env.REDIS_PORT ?? 6380),

  kafkaBrokers: required('KAFKA_BROKERS', 'localhost:9092').split(','),
  kafkaClickTopic: required('KAFKA_CLICK_TOPIC', 'url-clicks'),

  mongoUrl: required('MONGO_URL', 'mongodb://localhost:27018'),
  mongoDb: required('MONGO_DB', 'url_shortener_stats'),

  jwtSecret: required('JWT_SECRET'),
};