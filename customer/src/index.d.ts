import e from 'express';
import { HydratedDocument } from 'mongoose';
import { ICustomer } from './schemas/customer.schema';

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<ICustomer> | null;
    }
  }
}
