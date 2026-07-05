export type Priority = 'P1' | 'P2' | 'P3';
export type NotificationType = 'CRITICAL' | 'TRANSACTIONAL' | 'MARKETING';

export const priorityForType: Record<NotificationType, Priority> = {
  CRITICAL: 'P1',
  TRANSACTIONAL: 'P2',
  MARKETING: 'P3',
};

export interface NotificationRequest {
  id?: string;
  userId: string;
  type: NotificationType;
  campaignId?: string;    // required when type === 'MARKETING'
  businessKey?: string;   // required when type === 'TRANSACTIONAL'
  subject?: string;
  message: string;
}


export interface NotificationJobData extends NotificationRequest {
    id: string;
    createdAt: number;
}

export type EnqueueStatus = 'queued' | 'duplicate' | 'skipped_optout';

export interface EnqueueResult {
  id: string;
  status: EnqueueStatus;
  priority: Priority;
}
