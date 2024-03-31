import mongoose from 'mongoose';

export interface ICart {
  customerId?: string;
  items: ICartItem[];
}

export interface ICartItem {
  product: ICartItemProduct;
  unit: number;
}

export interface ICartItemProduct {
  _id: string;
  name?: string;
  description?: string;
  banner?: string;
  type?: string;
  unit?: number;
  price?: number;
  suplier?: string;
}

export const CartSchema = new mongoose.Schema<ICart>(
  {
    customerId: { type: String },
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

export const CartModel = mongoose.model('cart', CartSchema);
