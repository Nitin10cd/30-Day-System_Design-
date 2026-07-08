import { Request, Response } from 'express';
import { env } from '../config/env';

export function demoHandler(algorithm: string) {
  return function (req: Request, res: Response): void {
    res.json({
      ok: true,
      servedBy: env.instanceId, // proves it doesn't matter which instance answered
      algorithm,
      time: new Date().toISOString(),
    });
  };
}
