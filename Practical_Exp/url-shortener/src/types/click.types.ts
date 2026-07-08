export interface ClickEvent {
  shortCode: string;
  timestamp: number;
  ip: string;
  userAgent: string;
  os?: string;
  referrer?: string;
  country?: string;
}