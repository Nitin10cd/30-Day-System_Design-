import { Request, Response } from 'express';
import { StatsService } from '../services/stats.service';

function toSingleString(value: string | string[] | undefined, fallback = ''): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export async function getUrlStats(req: Request, res: Response): Promise<void> {
  const code = toSingleString(req.params.code); 
  const stats = await StatsService.getStatsFor(code);
  res.json(stats);
}