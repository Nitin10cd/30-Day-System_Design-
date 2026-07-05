import { z } from 'zod';

export const notificationRequestSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  type: z.enum(['CRITICAL', 'TRANSACTIONAL', 'MARKETING']),
  campaignId: z.string().optional(),
  businessKey: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
}).refine(
  (d) => d.type !== 'MARKETING' || !!d.campaignId,
  { message: 'campaignId is required for MARKETING notifications', path: ['campaignId'] }
).refine(
  (d) => d.type !== 'TRANSACTIONAL' || !!d.businessKey,
  { message: 'businessKey is required for TRANSACTIONAL notifications', path: ['businessKey'] }
);

