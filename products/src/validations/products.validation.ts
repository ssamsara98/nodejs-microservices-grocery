import { body, param } from 'express-validator';
import { validationMiddleware } from '~/middlewares/validation.middleware';

export class ProductsValidation {
  createProduct = [
    body('name').isString().optional(),
    body('description').isString().optional(),
    body('banner').isString().optional(),
    body('type').isString().optional(),
    body('unit').isNumeric().optional(),
    body('price').isNumeric().optional(),
    body('available').isBoolean().optional(),
    body('suplier').isString().optional(),
    validationMiddleware,
  ];

  categoryType = [param('type').isString(), validationMiddleware];

  productId = [param('productId').isString(), validationMiddleware];

  productIds = [body('productIds').isArray(), validationMiddleware];

  addWishlist = [body('productId').isString(), validationMiddleware];

  addToCart = [
    body('productId').isString(),
    body('quantity').isNumeric().optional(),
    validationMiddleware,
  ];
}

export const productsValidation = new ProductsValidation();
