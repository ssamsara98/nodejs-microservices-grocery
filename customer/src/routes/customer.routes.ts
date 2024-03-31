import { Router } from 'express';
import { customerController } from '~/controllers/customer.controller';
import { authMiddlware } from '~/middlewares/auth.middleware';
import { customerValidation } from '~/validations/customer.validation';

export const customerRoutes = Router();

/* GET users listing. */
customerRoutes.get('/whoami', customerController.whoami);
customerRoutes.get('/profile', authMiddlware, customerController.getProfile);
customerRoutes.post(
  '/address',
  authMiddlware,
  customerValidation.addNewAddress,
  customerController.addNewAddress,
);
customerRoutes.get('/shoping-details', authMiddlware, customerController.getShoppingDetails);
customerRoutes.get('/wishlist', authMiddlware, customerController.getWishList);
