import { randomUUID } from 'crypto';
import { redis } from '../config/redis.';
import { prisma } from '../config/prisma';
import { getQueue } from '../queues/queue.factory';
import { BloomFilterService } from '../services/bloomFilter.service';
import {
  EnqueueResult, NotificationJobData, NotificationRequest, Priority, priorityForType,
} from '../types/notification.types';

export class NotificationProducer {
  static async enqueue(req: NotificationRequest): Promise<EnqueueResult> {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) throw new Error('user not found');

    const priority = priorityForType[req.type];

    // opt-out is checked FIRST, before any dedup logic - cheapest possible
    // short circuit, and there's simply no dedup decision to make if we're
    // not sending anything anyway
    if (!user.emailOptIn) {
      await this.log(req, 'SKIPPED_OPTOUT');
      return { id: req.id ?? randomUUID(), status: 'skipped_optout', priority };
    }

    if (req.type === 'CRITICAL') return this.sendCritical(req, priority);
    if (req.type === 'MARKETING') return this.sendMarketing(req, priority);
    return this.sendTransactional(req, priority);
  }

  // CRITICAL: NO business-level dedup, on purpose. OTP resends, fraud alerts -
  // these should always get through even if it "looks like" a repeat.
  private static async sendCritical(req: NotificationRequest, priority: Priority): Promise<EnqueueResult> {
    const id = req.id ?? randomUUID();
    await this.log(req, 'QUEUED', id);
    await this.push(req, id, priority);
    return { id, status: 'queued', priority };
  }

  // MARKETING: bloom filter gate, keyed by (campaignId, userId).
  private static async sendMarketing(req: NotificationRequest, priority: Priority): Promise<EnqueueResult> {
    const dedupItem = `${req.campaignId}:${req.userId}`;
    const alreadySent = await BloomFilterService.mightContain(req.campaignId!, dedupItem);

    if (alreadySent) {
      await this.log(req, 'SKIPPED_DUPLICATE');
      return { id: req.id ?? randomUUID(), status: 'duplicate', priority };
    }

    const id = req.id ?? randomUUID();
    // claim BEFORE enqueueing - prevents two near-simultaneous requests
    // for the same (campaign, user) both slipping through
    await BloomFilterService.add(req.campaignId!, dedupItem);
    await this.log(req, 'QUEUED', id);
    await this.push(req, id, priority);
    return { id, status: 'queued', priority };
  }

  // TRANSACTIONAL: exact dedup on a caller-supplied business key
  // (e.g. "order:123:shipped"). Volume is bounded by real business events,
  // so a precise check is affordable and correctness actually matters here.
  private static async sendTransactional(req: NotificationRequest, priority: Priority): Promise<EnqueueResult> {
    const dedupKey = `notify:dedup:${req.businessKey}`;
    const claimed = await redis.set(dedupKey, '1', 'EX', 60 * 60 * 24 * 7, 'NX');

    if (claimed !== 'OK') {
      await this.log(req, 'SKIPPED_DUPLICATE');
      return { id: req.id ?? randomUUID(), status: 'duplicate', priority };
    }

    const id = req.id ?? randomUUID();
    await this.log(req, 'QUEUED', id);
    await this.push(req, id, priority);
    return { id, status: 'queued', priority };
  }

  // every outcome - queued, duplicate, opted-out - is written to NotificationDB.
  // this is the audit trail: "did user X get message Y, and if not, why"
  private static async log(req: NotificationRequest, status: string, id?: string) {
    await prisma.notificationLog.create({
      data: {
        id: id ?? randomUUID(),
        userId: req.userId,
        type: req.type,
        campaignId: req.campaignId,
        businessKey: req.businessKey,
        status: status as any,
        message: req.message,
      },
    });
  }

  // hand-off to the priority queue - your diagram's SQS1/P1/P2/P3 split
  private static async push(req: NotificationRequest, id: string, priority: Priority) {
    const jobData: NotificationJobData = { ...req, id, createdAt: Date.now() };
    await getQueue(priority).add('send-notification', jobData, {
      jobId: id, // BullMQ-level dedup on top of our own logic above
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }, // transient SMTP errors get retried
      removeOnComplete: { age: 3600, count: 1000 },
      removeOnFail: { age: 86400 },
    });
  }
}