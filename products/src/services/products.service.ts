import createHttpError from 'http-errors';
import { HydratedDocument } from 'mongoose';
import { CreateProductRequest, ProductIdsRequest } from '~/dto/products.request';
import { EventPayload } from '~/event';
import { DB, db } from '~/infrastructures/db';
import { IProduct } from '~/schemas/product.schema';

type ProductPayload = {
  productId: string;
  quantity?: number;
};

export class ProductsService {
  constructor(private readonly database: DB) {}

  async getProducts() {
    const products = await this.database.Product.find().exec();

    let categories: { [k: string]: string } = {};

    products.forEach(({ type }) => {
      if (type) categories[type] = type;
    });

    return {
      products,
      categories: Object.keys(categories),
    };
  }

  async createProduct(reqData: CreateProductRequest) {
    const productResult = await (async () => {
      const product = new this.database.Product({
        name: reqData.name,
        description: reqData.description,
        banner: reqData.banner,
        type: reqData.type,
        unit: reqData.unit,
        price: reqData.price,
        available: reqData.available,
        suplier: reqData.suplier,
      });

      return product.save();
    })();
    return productResult;
  }

  async getProductsByCategory(category: string) {
    const products = await this.database.Product.find({ type: category }).exec();
    return products;
  }

  async getProductDescription(id: string) {
    const product = await this.database.Product.findById(id).exec();
    if (!product) {
      throw createHttpError(404, 'No product Available');
    }
    return product;
  }

  async getSelectedProducts(reqData: ProductIdsRequest) {
    const products = await this.database.Product.find()
      .where('_id')
      .in(reqData.productIds.map((productId) => productId))
      .exec();
    return products;
  }

  async getProductPayload(userId: string, { productId, quantity }: ProductPayload, event: string) {
    const product = await this.database.Product.findById(productId).exec();
    if (!product) {
      throw createHttpError(404, 'No product Available');
    }

    const payload = (<T>(e: EventPayload<T>) => e)({ event, data: { userId, product, quantity } });
    return payload;
  }
}

export const productsService = new ProductsService(db);
