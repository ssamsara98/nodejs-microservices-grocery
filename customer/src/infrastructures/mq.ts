import amqplib from 'amqplib';
import { env } from '~/config/env.config';

export class MQ {
  channel: amqplib.Channel | null;

  constructor() {
    this.channel = null;
  }

  async connect() {
    try {
      const connection = await amqplib.connect(env.MESSAGE_QUEUE_URL!);
      this.channel = await connection.createChannel();
      // await channel.assertQueue(env.EXCHANGE_NAME!, 'direct', { durable: true });
      await this.channel.assertExchange(env.EXCHANGE_NAME!, 'direct', {
        durable: true,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async publish(service: string, msg: string) {
    if (this.channel) {
      try {
        this.channel.publish(env.EXCHANGE_NAME!, service, Buffer.from(msg));
        console.log(`Sent: ${msg} --> ${service}`);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
}

export const mq = new MQ();
