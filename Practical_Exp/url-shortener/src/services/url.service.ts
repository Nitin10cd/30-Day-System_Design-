import { prisma } from '../config/prisma';
import { ShortCodeService } from './shortCode.service';
import { CreateUrlInput } from '../types/url.schema';

export class UrlService {
  static async createShortUrl(input: CreateUrlInput, userId?: string) {
    const shortCode = input.customAlias
      ? await this.reserveCustomAlias(input.customAlias)
      : await ShortCodeService.generateUnique();

    return prisma.url.create({
      data: {
        shortCode,
        longUrl: input.longUrl,
        userId: userId ?? null,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });
  }

  private static async reserveCustomAlias(alias: string): Promise<string> {
    const existing = await prisma.url.findUnique({ where: { shortCode: alias } });
    if (existing) throw new Error('alias_taken');
    return alias;
  }

  static async resolve(shortCode: string) {
    const url = await prisma.url.findUnique({ where: { shortCode } });
    if (!url || !url.isActive) return null;
    if (url.expiresAt && url.expiresAt < new Date()) return null;
    return url;
  }

  static async incrementClickCount(shortCode: string) {
    await prisma.url.update({ where: { shortCode }, data: { clicks: { increment: 1 } } });
  }
}