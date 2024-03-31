import { Router } from 'express';
import { productsController } from '~/controllers/products.controller';
import { authMiddlware } from '~/middlewares/auth.middleware';
import { productsValidation } from '~/validations/products.validation';

export const productsRoutes = Router();

/* GET users listing. */
productsRoutes.get('/', productsController.index);
productsRoutes.get('/whoami', productsController.whoami);
productsRoutes.post(
  '/product/create',
  productsValidation.createProduct,
  productsController.createProduct,
);
productsRoutes.get(
  '/category/:type',
  productsValidation.categoryType,
  productsController.getProductsByCategory,
);
productsRoutes.get(
  '/:productId',
  productsValidation.productId,
  productsController.getProductDescription,
);
productsRoutes.post('/ids', productsValidation.productIds, productsController.getSelectedProducts);

productsRoutes
  .use(authMiddlware)
  .patch('/wishlist', productsValidation.addWishlist, productsController.addWishlist)
  .delete('/wishlist/:productId', productsValidation.productId, productsController.deleteWishlist)
  .patch('/cart', productsValidation.addToCart, productsController.addToCart)
  .delete('/cart/:productId', productsValidation.productId, productsController.deleteFromCart);
