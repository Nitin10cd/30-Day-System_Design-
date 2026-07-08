import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../types/auth.schema';
import { AuthService } from '../services/auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() });
    return;
  }
  try {
    const user = await AuthService.register(parsed.data.name, parsed.data.email, parsed.data.password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() });
    return;
  }
  try {
    const result = await AuthService.login(parsed.data.email, parsed.data.password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}