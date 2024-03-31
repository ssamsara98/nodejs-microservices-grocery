import { Router } from 'express';
import { authController } from '~/controllers/auth.controller';
import { authValidation } from '~/validations/auth.validation';

export const authRoutes = Router();

authRoutes.post('/register', authValidation.register, authController.register);
authRoutes.post('/login', authValidation.login, authController.login);
