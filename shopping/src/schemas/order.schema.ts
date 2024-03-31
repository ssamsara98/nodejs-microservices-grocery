import mongoose from 'mongoose';

export interface IOrder {
  orderId: string;
  customerId: string;
  amount: number;
  status: string;
  items: IOrderItem[];
}

export interface IOrderItem {
  product: IOrderItemProduct;
  unit: number;
}

export interface IOrderItemProduct {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  banner?: string;
  unit?: number;
  price?: number;
  suplier?: string;
}

export const OrderSchema = new mongoose.Schema<IOrder>(
  {
    orderId: { type: String },
    customerId: { type: String },
    amount: { type: Number },
    status: { type: String },
    items: [
      {
        type: {
          product: {
            _id: { type: String, require: true },
            name: { type: String },
            description: { type: String },
            banner: { type: String },
            type: { type: String },
            unit: { type: Number },
            price: { type: Number },
            suplier: { type: String },
          },
          unit: { type: Number, require: true },
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const OrderModel = mongoose.model('order', OrderSchema);
