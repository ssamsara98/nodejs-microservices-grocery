import createHttpError from 'http-errors';
import { v4 } from 'uuid';
import { DB, db } from '~/infrastructures/db';

export class ShoppingService {
  constructor(private readonly db: DB) {}

  async getCart(customerId: string) {
    const cartItems = await this.db.Cart.find({ customerId });
    if (!cartItems) {
      throw createHttpError(404, 'Cart Not Found!');
    }

    return cartItems;
  }

  async addToCart(customerId: string, productId: string) {
    return { customerId, productId };
  }

  async manageCart(customerId: string, item: any, quantity: number, isRemove: boolean) {
    const result = await (async () => {
      const cart = await this.db.Cart.findOne({ customerId });
      const { _id } = item;

      if (cart) {
        let isExist = false;
        const cartItems = cart.items;

        if (cartItems.length > 0) {
          for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = quantity;
              }
              isExist = true;
              break;
            }
          }
        }

        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item }, unit: quantity });
        }

        cart.items = cartItems;
        return await cart.save();
      } else {
        return await this.db.Cart.create({
          customerId,
          items: [{ product: { ...item }, unit: quantity }],
        });
      }
    })();
    return result;
  }

  async getOrders(customerId: string) {
    const orders = await this.db.Order.find({ customerId });
    if (!orders) {
      throw createHttpError(404, 'No Available Orders');
    }
    return orders;
  }

  async placeOrder(customerId: string, txnId: string) {
    const orderResult = (async () => {
      //required to verify payment through TxnId
      const cart = await this.db.Cart.findOne({ customerId: customerId });
      if (!cart) {
        throw createHttpError(400, 'Cart Empty');
      }

      let amount = 0;
      if (cart.items.length > 0) {
        //process Order
        cart.items.forEach((item) => {
          amount += parseInt(item.product.price?.toString()!) * parseInt(item.unit.toString());
        });

        const orderId = v4();
        const order = new this.db.Order({
          orderId,
          customerId,
          amount,
          status: 'received',
          items: cart.items,
        });
        cart.items = [];
        const orderResult = await order.save();
        await cart.save();
        return orderResult;
      }
    })();

    return orderResult;
  }

  async getOrderPayload<T>(userId: string, order: T, event: string) {
    if (!order) {
      throw createHttpError(404, 'No Order Available');
    }

    const payload = {
      event: event,
      data: { userId, order },
    };
    return payload;
  }
}

export const shoppingService = new ShoppingService(db);
