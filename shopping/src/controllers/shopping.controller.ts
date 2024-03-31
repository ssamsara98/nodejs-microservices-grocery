import expressAsyncHandler from 'express-async-handler';
import { env } from '~/config/env.config';
import { AddToCart, PlaceOrderRequest } from '~/dto/shopping.request';
import { MQ, mq } from '~/infrastructures/mq';
import { ShoppingService, shoppingService } from '~/services/shopping.service';
import { successJson } from '~/utils/response';

export class ShoppingController {
  constructor(
    private readonly shoppingService: ShoppingService,
    private readonly mq: MQ,
  ) {}

  whoami = expressAsyncHandler(async (req, res) => {
    res.json({ msg: '/shoping : I am Shopping Service' });
  });

  getCart = expressAsyncHandler(async (req, res) => {
    const result = await this.shoppingService.getCart(req.user?.id!);
    res.json(successJson(result));
  });

  addToCart = expressAsyncHandler<any, any, AddToCart>(async (req, res) => {
    const result = await this.shoppingService.addToCart(req.user?.id!, req.body.productId);
    res.json(successJson(result));
  });

  getOrders = expressAsyncHandler(async (req, res) => {
    const result = await this.shoppingService.getOrders(req.user?.id!);
    res.json(successJson(result));
  });

  placeOrder = expressAsyncHandler<any, any, PlaceOrderRequest>(async (req, res) => {
    const result = await this.shoppingService.placeOrder(req.user?.id!, req.body.txnId);

    const payload = await this.shoppingService.getOrderPayload(
      req.user?.id!,
      result,
      'CREATE_ORDER',
    );

    // PublishCustomerEvent(payload)
    this.mq.publish(env.CUSTOMER_SERVICE, JSON.stringify(payload));

    res.json(successJson(result));
  });
}

export const shoppingController = new ShoppingController(shoppingService, mq);
