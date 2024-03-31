import { Router } from 'express';
import { shoppingController } from '~/controllers/shopping.controller';
import { authMiddlware } from '~/middlewares/auth.middleware';
import { shoppingValidation } from '~/validations/shopping.validation';

export const shoppingRoutes = Router();

/* GET users listing. */
shoppingRoutes.get('/whoami', shoppingController.whoami);
shoppingRoutes
  .use(authMiddlware)
  // .get('/cart', shoppingValidation.addToCart, shoppingController.getCart)
  // .patch('/cart', shoppingValidation.addToCart, shoppingController.addToCart)
  // .delete('/cart/:cartId', shoppingValidation.cartId, shoppingController.addToCart)
  .get('/orders', shoppingController.getOrders)
  .post('/order', shoppingValidation.placeOrder, shoppingController.placeOrder);
