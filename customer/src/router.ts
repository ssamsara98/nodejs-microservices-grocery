import { Router } from 'express';
import * as routes from './routes';

export const router = Router();

router.use('/', routes.authRoutes);
router.use('/', routes.customerRoutes);
