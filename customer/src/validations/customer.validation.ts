import { body } from 'express-validator';
import { validationMiddleware } from '~/middlewares/validation.middleware';

export class CustomerValidation {
  addNewAddress = [
    body('street').isString().optional(),
    body('city').isString().optional(),
    body('country').isString().optional(),
    body('postalCode').isString().optional(),
    validationMiddleware,
  ];
}

export const customerValidation = new CustomerValidation();
