import mongoose from 'mongoose';

export interface IAddress {
  id: mongoose.Types.ObjectId;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export const AddressSchema = new mongoose.Schema<IAddress>(
  {
    street: { type: String },
    postalCode: { type: String },
    city: { type: String },
    country: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const AddressModel = mongoose.model('address', AddressSchema);
