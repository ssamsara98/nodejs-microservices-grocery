import { body, param } from 'express-validator';
import { validationMiddleware } from '~/middlewares/validation.middleware';

export class ShoppingValidation {
  addToCart = [
    body('productId').isString(),
    body('quantity').isNumeric().optional(),
    validationMiddleware,
  ];

  cartId = [param('cartId').isString(), validationMiddleware];

  placeOrder = [body('txnId').isString().default('').optional(), validationMiddleware];
}

export const shoppingValidation = new ShoppingValidation();
