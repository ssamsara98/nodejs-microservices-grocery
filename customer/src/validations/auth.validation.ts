import { body } from 'express-validator';
import { validationMiddleware } from '~/middlewares/validation.middleware';

export class AuthValidation {
  register = [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 36 }),
    body('telephone').isDate().optional(),
    validationMiddleware,
  ];

  login = [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6, max: 36 }),
    validationMiddleware,
  ];
}

export const authValidation = new AuthValidation();
