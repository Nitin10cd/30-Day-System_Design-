import { kafka } from '../config/kafka';
import { env } from '../config/env';
import { getMongoDb } from '../config/mongo';
import { ClickEvent } from '../types/click.types';

function parseOs(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac os/i.test(userAgent)) return 'macOS';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad/i.test(userAgent)) return 'iOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  return 'Unknown';
}

export async function startClickConsumer() {
  const consumer = kafka.consumer({ groupId: 'stats-consumer-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: env.kafkaClickTopic, fromBeginning: false });

  const db = await getMongoDb();
  const clicks = db.collection('clicks');

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const event: ClickEvent = JSON.parse(message.value.toString());

      await clicks.insertOne({
        ...event,
        os: parseOs(event.userAgent),
        createdAt: new Date(event.timestamp),
      });

      console.log(`[consumer] recorded click for ${event.shortCode}`);
    },
  });

  console.log('[consumer] listening on topic', env.kafkaClickTopic);
}