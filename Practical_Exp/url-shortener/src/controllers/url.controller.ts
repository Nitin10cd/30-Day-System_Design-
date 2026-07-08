import { Response } from 'express';
import { createUrlSchema } from '../types/url.schema';
import { UrlService } from '../services/url.service';
import { ClickProducer } from '../producers/click.producer';
import { env } from '../config/env';
import { AuthRequest } from '../middlewares/auth.middleware';

// helper: header ya param jo bhi string | string[] | undefined ho, usse
// hamesha ek clean string mein convert karo
function toSingleString(value: string | string[] | undefined, fallback = ''): string {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export async function createShortUrl(req: AuthRequest, res: Response): Promise<void> {
  const parsed = createUrlSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_request', details: parsed.error.flatten() });
    return;
  }
  try {
    const url = await UrlService.createShortUrl(parsed.data, req.userId);
    res.status(201).json({ shortUrl: `${env.baseUrl}/${url.shortCode}`, ...url });
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
}

export async function redirectShortUrl(req: AuthRequest, res: Response): Promise<void> {
  const code = toSingleString(req.params.code); // 👈 fix 1

  const url = await UrlService.resolve(code);

  if (!url) {
    res.status(404).json({ error: 'not_found' });
    return;
  }

  res.redirect(302, url.longUrl);

  ClickProducer.publish({
    shortCode: code,
    timestamp: Date.now(),
    ip: req.ip ?? 'unknown',
    userAgent: toSingleString(req.headers['user-agent'], 'unknown'), // 👈 fix 2
    referrer: toSingleString(req.headers['referer'], undefined as any) || undefined,
  }).catch((err) => console.error('[kafka] failed to publish click event:', err));

  UrlService.incrementClickCount(code).catch((err) =>
    console.error('[postgres] failed to increment click count:', err)
  );
}