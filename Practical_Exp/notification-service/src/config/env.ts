import dotenv from 'dotenv';
dotenv.config();

function required(name: string, fallback?: string): string {
  const val = process.env[name] ?? fallback;
  if (val === undefined) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),

  redisHost: required('REDIS_HOST', 'localhost'),
  redisPort: Number(process.env.REDIS_PORT ?? 6379),

  workerPriority: required('WORKER_PRIORITY', 'P1') as 'P1' | 'P2' | 'P3',
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY ?? 5),

  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  emailFrom: process.env.EMAIL_FROM ?? 'no-reply@example.com',
};