import mongoose from 'mongoose';
import { comparePassword, hashPassword } from '~/utils/bcrypt.helper';

export interface ICustomer {
  id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  telephone: string;
  address: mongoose.Types.ObjectId[];
  cart: ICustomerCart[];
  wishlist: ICustomerWishlist[];
  orders: ICustomerOrder[];

  comparePassword: (password: string) => Promise<boolean>;
}

export interface ICustomerCart {
  product: ICustomerCartProduct;
  unit: number;
}

export interface ICustomerCartProduct {
  _id: string;
  name: string;
  banner: string;
  price: number;
}

export interface ICustomerWishlist {
  _id: string;
  name: string;
  description: string;
  banner: string;
  available: boolean;
  price: number;
}

export interface ICustomerOrder {
  _id: string;
  amount: string;
  date: Date;
}

export const CustomerSchema = new mongoose.Schema<ICustomer>(
  {
    email: String,
    password: String,
    telephone: String,
    address: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'address', require: true }],
    },
    cart: {
      type: [
        {
          product: {
            type: {
              _id: { type: String, require: true },
              name: { type: String },
              banner: { type: String },
              price: { type: Number },
            },
          },
          unit: { type: Number, require: true },
        },
      ],
    },
    wishlist: {
      type: [
        {
          _id: { type: String, require: true },
          name: { type: String },
          description: { type: String },
          banner: { type: String },
          available: { type: Boolean },
          price: { type: Number },
        },
      ],
    },
    orders: {
      type: [
        {
          _id: { type: String, required: true },
          amount: { type: String },
          date: { type: Date, default: Date.now() },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
);

CustomerSchema.pre('save', async function () {
  if (this.__v === undefined) {
    this.password = await hashPassword(this.password);
  }
});

CustomerSchema.method('comparePassword', async function (password) {
  const isMatched = await comparePassword(password, this.password);
  return isMatched;
});

export const CustomerModel = mongoose.model('customer', CustomerSchema);
