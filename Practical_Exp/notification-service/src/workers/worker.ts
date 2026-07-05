import { Job, Worker } from 'bullmq';
import { redisConnectionOptions } from '../config/redis.';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { queueNameFor } from '../queues/queue.factory';
import { NotificationJobData } from '../types/notification.types';
import { sendEmail } from '../services/email.service';

const priority = env.workerPriority;
const queueName = queueNameFor(priority);

async function processJob(job: Job<NotificationJobData>): Promise<void> {
  const { id, userId, subject, message } = job.data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('user not found');

  console.log(`[worker:${priority}] processing job ${id} (EMAIL -> ${user.email})`);

  try {
    await sendEmail({ to: user.email, subject, message });
    await prisma.notificationLog.update({ where: { id }, data: { status: 'SENT' } });
  } catch (err) {
    await prisma.notificationLog.update({ where: { id }, data: { status: 'FAILED' } });
    throw err; // re-throw so BullMQ's attempts/backoff config actually retries
  }
}

const worker = new Worker<NotificationJobData>(queueName, processJob, {
  connection: redisConnectionOptions,
  concurrency: env.workerConcurrency,
});

worker.on('completed', (job) => console.log(`[worker:${priority}] job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`[worker:${priority}] job ${job?.id} failed:`, err.message));

console.log(`[worker:${priority}] listening on "${queueName}" with concurrency ${env.workerConcurrency}`);

process.on('SIGTERM', async () => {
  console.log(`[worker:${priority}] shutting down...`);
  await worker.close();
  process.exit(0);
});