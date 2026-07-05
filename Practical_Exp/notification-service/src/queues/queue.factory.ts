import { Queue } from 'bullmq';
import { redisConnectionOptions } from '../config/redis.';
import { NotificationJobData, Priority } from '../types/notification.types';

export const queueNameFor = (priority: Priority) => `notifications-${priority}`;

const queues: Record<Priority, Queue<NotificationJobData>> = {
  P1: new Queue<NotificationJobData>(queueNameFor('P1'), { connection: redisConnectionOptions }),
  P2: new Queue<NotificationJobData>(queueNameFor('P2'), { connection: redisConnectionOptions }),
  P3: new Queue<NotificationJobData>(queueNameFor('P3'), { connection: redisConnectionOptions }),
};

export const getQueue = (priority: Priority): Queue<NotificationJobData> => queues[priority];
export const allQueues = queues;