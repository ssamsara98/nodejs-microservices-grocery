import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { env } from '~/config/env.config';
import { eventConstant } from '~/config/event.config';
import {
  CategoryTypeParam,
  CreateProductRequest,
  ProductIdParam,
  ProductIdsRequest,
} from '~/dto/products.request';
import { MQ, mq } from '~/infrastructures/mq';
import { ProductsService, productsService } from '~/services/products.service';
import { successJson } from '~/utils/response';

export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly mq: MQ,
  ) {}

  index = expressAsyncHandler(async (req, res) => {
    //check validation
    try {
      const result = await this.productsService.getProducts();
      res.json(successJson(result));
    } catch (err) {
      throw createHttpError(404, (err as Error).message);
    }
  });

  whoami = expressAsyncHandler(async (req, res) => {
    res.json({ msg: '/ or /products : I am products Service' });
  });

  createProduct = expressAsyncHandler<any, any, CreateProductRequest>(async (req, res) => {
    const result = await this.productsService.createProduct(req.body);
    res.json(successJson(result));
  });

  getProductsByCategory = expressAsyncHandler<CategoryTypeParam>(async (req, res) => {
    try {
      const result = await this.productsService.getProductsByCategory(req.params.type);
      res.json(successJson(result));
    } catch (err) {
      throw createHttpError(404, (err as Error).message);
    }
  });

  getProductDescription = expressAsyncHandler<ProductIdParam>(async (req, res) => {
    try {
      const result = await this.productsService.getProductDescription(req.params.productId);
      res.json(successJson(result));
    } catch (err) {
      throw createHttpError(404, (err as Error).message);
    }
  });

  getSelectedProducts = expressAsyncHandler<any, any, ProductIdsRequest>(async (req, res) => {
    const result = await this.productsService.getSelectedProducts(req.body);
    res.json(successJson(result));
  });

  addWishlist = expressAsyncHandler<any, any, ProductIdParam>(async (req, res) => {
    const payload = await this.productsService.getProductPayload(
      req.user?.id!,
      { productId: req.body.productId },
      eventConstant.addToWishlist,
    );

    // PublishCustomerEvent(data);
    this.mq.publish(env.CUSTOMER_SERVICE, JSON.stringify(payload));

    res.json(successJson(payload.data.product));
  });

  deleteWishlist = expressAsyncHandler<ProductIdParam>(async (req, res) => {
    const payload = await this.productsService.getProductPayload(
      req.user?.id!,
      { productId: req.params.productId },
      eventConstant.removeFromWishlist,
    );

    // PublishCustomerEvent(data);
    this.mq.publish(env.CUSTOMER_SERVICE, JSON.stringify(payload));

    res.json(successJson(payload.data.product));
  });

  addToCart = expressAsyncHandler(async (req, res) => {
    const payload = await this.productsService.getProductPayload(
      req.user?.id!,
      { productId: req.body.productId, quantity: req.body.quantity },
      eventConstant.addToCart,
    );

    // PublishCustomerEvent(data);
    // PublishShoppingEvent(data);

    this.mq.publish(env.CUSTOMER_SERVICE, JSON.stringify(payload));
    this.mq.publish(env.SHOPPING_SERVICE, JSON.stringify(payload));

    const response = { product: payload.data.product, unit: payload.data.quantity };

    res.json(successJson(response));
  });

  deleteFromCart = expressAsyncHandler<ProductIdParam>(async (req, res, next) => {
    const payload = await this.productsService.getProductPayload(
      req.user?.id!,
      { productId: req.params.productId },
      eventConstant.removeFromCart,
    );

    // PublishCustomerEvent(data);
    // PublishShoppingEvent(data);

    this.mq.publish(env.CUSTOMER_SERVICE, JSON.stringify(payload));
    this.mq.publish(env.SHOPPING_SERVICE, JSON.stringify(payload));

    const response = { product: payload.data.product, unit: payload.data.quantity };

    res.json(successJson(response));
  });
}

export const productsController = new ProductsController(productsService, mq);
