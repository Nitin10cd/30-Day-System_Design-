import { MongoClient, Db } from 'mongodb';
import { env } from './env';

let db: Db | null = null;

export async function getMongoDb(): Promise<Db> {
  if (db) return db;
  const client = new MongoClient(env.mongoUrl);
  await client.connect();
  db = client.db(env.mongoDb);
  await db.collection('clicks').createIndex({ shortCode: 1, timestamp: -1 });
  return db;
}