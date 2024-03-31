import { env } from './config/env.config';
import { eventConstant } from './config/event.config';
import { MQ, mq } from './infrastructures/mq';
import { CustomerService, customerService } from './services/customer.service';

class Event {
  constructor(
    private readonly mq: MQ,
    private readonly customerService: CustomerService,
  ) {}

  async subcribe() {
    if (this.mq.channel) {
      await this.mq.channel.assertExchange(env.EXCHANGE_NAME!, 'direct', { durable: true });
      const q = await this.mq.channel.assertQueue('', { exclusive: true });
      console.log(` Waiting for messages in queue: ${q?.queue}`);

      this.mq.channel.bindQueue(q.queue, env.EXCHANGE_NAME!, env.CUSTOMER_SERVICE);

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

      return env.CUSTOMER_SERVICE;
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
        case eventConstant.addToWishlist:
        case eventConstant.removeFromWishlist:
          this.customerService.addToWishlist(userId, product);
          break;
        case eventConstant.addToCart:
          this.customerService.manageCart(userId, product, quantity, false);
          break;
        case eventConstant.removeFromCart:
          this.customerService.manageCart(userId, product, quantity, true);
          break;
        case eventConstant.createOrder:
          this.customerService.manageOrder(userId, order);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  }
}

export const event = new Event(mq, customerService);
