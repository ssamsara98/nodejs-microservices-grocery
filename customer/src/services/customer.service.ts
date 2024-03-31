import createHttpError from 'http-errors';
import { AddNewAddressRequest } from '~/dto/customer.request';
import { DB, db } from '~/infrastructures/db';
import { ICustomerCartProduct } from '~/schemas/customer.schema';

export class CustomerService {
  constructor(private readonly db: DB) {}

  private async findCustomerById(id: string) {
    const existingCustomer = await this.db.Customer.findById(id).populate('address');
    return existingCustomer;
  }

  async getProfile(id: string) {
    const existingCustomer = await this.findCustomerById(id);
    return existingCustomer;
  }

  async addNewAddress(id: string, reqData: AddNewAddressRequest) {
    const addressResult = await (async (id: string, reqData: AddNewAddressRequest) => {
      const profile = await this.db.Customer.findById(id);

      if (profile) {
        const newAddress = new this.db.Address({
          street: reqData.street,
          postalCode: reqData.postalCode,
          city: reqData.city,
          country: reqData.country,
        });
        await newAddress.save();
        profile.address.push(newAddress.id);
      }

      return await profile?.save();
    })(id, reqData);

    return addressResult;
  }

  async getShoppingDetails(id: string) {
    const existingCustomer = await this.findCustomerById(id);

    if (existingCustomer) {
      return existingCustomer;
    }
    throw createHttpError(400, 'Error');
  }

  async getWishList(id: string) {
    const wishListItems = await (async (id: string) => {
      const profile = this.db.Customer.findById(id).populate('wishlist');
      return profile.then((p) => p?.wishlist);
    })(id);
    return wishListItems;
  }

  async addToWishlist(customerId: string, product: any) {
    const wishlistResult = await (async () => {
      const profile = await this.db.Customer.findById(customerId).populate('wishlist');
      if (!profile) {
        throw new Error('Profile Not Found');
      }

      const wishlist = profile.wishlist;
      if (wishlist.length > 0) {
        let isExist = false;
        wishlist.forEach((item) => {
          if (item._id.toString() === product._id.toString()) {
            const index = wishlist.indexOf(item);
            wishlist.splice(index, 1);
            isExist = true;
          }
        });

        if (!isExist) {
          wishlist.push(product);
        }
      } else {
        wishlist.push(product);
      }

      profile.wishlist = wishlist;
      const profileResult = await profile.save();
      return profileResult.wishlist;
    })();
    return wishlistResult;
  }

  async manageCart(
    customerId: string,
    product: ICustomerCartProduct,
    quantity: number,
    isRemove: boolean,
  ) {
    // const cartResult = await this.repository.AddCartItem(customerId, product, quantity, isRemove);
    const cartResult = await (async () => {
      const profile = await this.db.Customer.findById(customerId).populate('cart');
      if (!profile) {
        throw new Error('Unable to add to cart!');
      }

      const cartItem = {
        product,
        unit: quantity,
      };

      const cartItems = profile.cart;
      if (cartItems.length > 0) {
        let isExist = false;
        cartItems.forEach((item) => {
          if (item.product._id.toString() === product._id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1);
            } else {
              item.unit = quantity;
            }
            isExist = true;
          }
        });

        if (!isExist) {
          cartItems.push(cartItem);
        }
      } else {
        cartItems.push(cartItem);
      }

      profile.cart = cartItems;
      return await profile.save();
    })();
    return cartResult;
  }

  async manageOrder(customerId: string, order: any) {
    const orderResult = await (async () => {
      const profile = await this.db.Customer.findById(customerId);
      if (profile) {
        if (profile.orders == undefined) {
          profile.orders = [];
        }
        profile.orders.push(order);
        profile.cart = [];
        const profileResult = await profile.save();
        return profileResult;
      }
      throw new Error('Unable to add to order!');
    })();
    return orderResult;
  }
}

export const customerService = new CustomerService(db);
