import mongoose from 'mongoose';
import { env } from '~/config/env.config';
import { ProductModel } from '~/schemas/product.schema';

export class DB {
  mongodb: typeof mongoose | null;

  constructor(public readonly Product: typeof ProductModel) {
    this.mongodb = null;
  }

  async connect() {
    try {
      this.mongodb = await mongoose.connect(env.MONGODB_URI!, {
        // useCreateIndex: true,
        // useFindAndModify: false,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      });
      if (env.NODE_ENV !== 'production') {
        this.mongodb.set('debug', true);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export const db = new DB(ProductModel);
