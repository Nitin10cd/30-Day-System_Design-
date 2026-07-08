import { Kafka } from 'kafkajs';
import { env } from './env';

export const kafka = new Kafka({
  clientId: 'url-shortener',
  brokers: env.kafkaBrokers,
});