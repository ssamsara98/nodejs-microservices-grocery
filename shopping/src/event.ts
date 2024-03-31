import { env } from './config/env.config';
import { eventConstant } from './config/event.config';
import { MQ, mq } from './infrastructures/mq';
import { ShoppingService, shoppingService } from './services/shopping.service';

class Event {
  constructor(
    private readonly mq: MQ,
    private readonly shoppingService: ShoppingService,
  ) {}

  async subcribe() {
    if (this.mq.channel) {
      await this.mq.channel.assertExchange(env.EXCHANGE_NAME!, 'direct', { durable: true });
      const q = await this.mq.channel.assertQueue('', { exclusive: true });
      console.log(` Waiting for messages in queue: ${q.queue}`);

      this.mq.channel.bindQueue(q.queue, env.EXCHANGE_NAME!, env.SHOPPING_SERVICE);

      this.mq.channel.consume(
        q.queue,
        (msg) => {
          if (msg) {
            if (msg.content) {
              console.log('the message is:', msg.content.toString());
              // service.SubscribeEvents(msg.content.toString());
              this.consumeContent(msg.content.toString());
            }
            console.log('[X] received');
          } else {
            console.log('No message');
          }
        },
        {
          noAck: true,
        },
      );

      return env.SHOPPING_SERVICE;
    }
    return null;
  }

  private async consumeContent(messageContent: string) {
    try {
      console.log(`Triggering.... "${env.CUSTOMER_SERVICE}" events`);
      const payload = JSON.parse(messageContent);

      const { event, data } = payload;
      const { userId, product, order, quantity } = data;

      switch (event) {
        case eventConstant.addToCart:
          this.shoppingService.manageCart(userId, product, quantity, false);
          break;
        case eventConstant.removeFromCart:
          this.shoppingService.manageCart(userId, product, quantity, true);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  }
}

export const event = new Event(mq, shoppingService);
