import { Request, Response } from 'express';
import { notificationRequestSchema } from '../types/notification.schema';
import { NotificationProducer } from '../producers/notification.producer';

export async function createNotification(req: Request, res: Response): Promise<void> {
  const parsed = notificationRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() });
    return;
  }

  const result = await NotificationProducer.enqueue(parsed.data);

  if (result.status === 'queued') {
    res.status(202).json(result);
  } else {
    res.status(200).json(result);
  }
}