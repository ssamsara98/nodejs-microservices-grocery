import mongoose from 'mongoose';

export interface IProduct {
  name?: string;
  description?: string;
  banner?: string;
  type?: string;
  unit?: number;
  price?: number;
  available?: boolean;
  suplier?: string;
}

export const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String },
    description: { type: String },
    banner: { type: String },
    type: { type: String },
    unit: { type: Number },
    price: { type: Number },
    available: { type: Boolean },
    suplier: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const ProductModel = mongoose.model('product', ProductSchema);
