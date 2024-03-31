import { Router } from 'express';
import * as routes from './routes';

export const router = Router();

router.use('/', routes.shoppingRoutes);
