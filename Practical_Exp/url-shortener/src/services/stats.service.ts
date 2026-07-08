import { getMongoDb } from '../config/mongo';

export class StatsService {
  static async getStatsFor(shortCode: string) {
    const db = await getMongoDb();
    const clicks = db.collection('clicks');

    const [totalClicks, byOs, byDay] = await Promise.all([
      clicks.countDocuments({ shortCode }),
      clicks.aggregate([
        { $match: { shortCode } },
        { $group: { _id: '$os', count: { $sum: 1 } } },
      ]).toArray(),
      clicks.aggregate([
        { $match: { shortCode } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]).toArray(),
    ]);

    return { shortCode, totalClicks, byOs, byDay };
  }
}