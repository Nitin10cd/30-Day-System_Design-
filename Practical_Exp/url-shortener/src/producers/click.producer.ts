import { kafka } from '../config/kafka';
import { env } from '../config/env';
import { ClickEvent } from '../types/click.types';

const producer = kafka.producer();
let connected = false;

async function ensureConnected() {
  if (!connected) {
    await producer.connect();
    connected = true;
  }
}

export class ClickProducer {
  static async publish(event: ClickEvent): Promise<void> {
    await ensureConnected();
    await producer.send({
      topic: env.kafkaClickTopic,
      messages: [{ key: event.shortCode, value: JSON.stringify(event) }],
    });
  }
}