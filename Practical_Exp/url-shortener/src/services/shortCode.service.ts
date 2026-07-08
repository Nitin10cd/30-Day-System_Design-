import { randomInt } from 'crypto';
import { prisma } from '../config/prisma';
import { BloomFilterService } from './bloomFilter.service';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODE_LENGTH = 7;
const MAX_ATTEMPTS = 5;

function generateCandidate(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) code += CHARSET[randomInt(0, CHARSET.length)];
  return code;
}

export class ShortCodeService {
  static async generateUnique(): Promise<string> {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const candidate = generateCandidate();

      const maybeExists = await BloomFilterService.mightContain(candidate);
      if (!maybeExists) {
        await BloomFilterService.add(candidate);
        return candidate;
      }

      const existing = await prisma.url.findUnique({ where: { shortCode: candidate } });
      if (!existing) {
        await BloomFilterService.add(candidate);
        return candidate;
      }
    }
    throw new Error('Failed to generate unique short code after max attempts');
  }
}